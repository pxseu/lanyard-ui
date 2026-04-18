import type {
	Presence,
	SocketMessageReceive,
	SocketMessageSend,
} from "lanyard";
import { useEffect, useReducer, useRef } from "react";
import {
	KEY_ID,
	KEY_MAX_LENGTH,
	KEY_REGEX,
	KEY_TOKEN,
	LANYARD_BASE_URL,
	MAX_KEYS_AMOUNT,
	MAX_RECONNECT_TIME,
	PRESENCE_KEY,
	PRODUCTION,
	RECONNECT_INTERVAL,
	SOCKET_URL,
	USER_REGEX,
	VALUE_MAX_LENGTH,
} from "@/utils/consts";
import { getPresence, getToken } from "@/utils/getCached";
import { logger } from "@/utils/log";
import { parse, stringify } from "@/utils/parse";

declare global {
	interface Window {
		socket?: WebSocket;
	}
}

enum Events {
	presence = "presence",
	open = "open",
	close = "close",
	subscribe = "subscribe",
	token = "token",
	toggleStore = "toggleStore",
}

enum Errors {
	notFound = "Could not find this user",
	socketNotReady = "Socket is not connected",
}

interface State {
	presence: Presence | null;
	connected: boolean;
	subscribed: string | null;
	token: string | null;
	store: boolean;
}

type Action =
	| {
			type: Events.open | Events.close | Events.toggleStore;
	  }
	| {
			type: Events.presence;
			payload: Presence;
	  }
	| {
			type: Events.subscribe | Events.token;
			payload: string;
	  };

type KVMethod = "PUT" | "PATCH" | "DELETE";

const socketLog = logger("info", "Socket", true);
const lanyardLog = logger("info", "Lanyard");

const getInitialState = (): State => {
	const token = getToken();

	return {
		presence: getPresence(),
		connected: false,
		subscribed: null,
		token,
		store: token !== null,
	};
};

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case Events.open: {
			socketLog("Socket opened");

			return {
				...state,
				connected: true,
			};
		}

		case Events.close: {
			socketLog("Socket closed");

			return {
				...state,
				connected: false,
			};
		}

		case Events.presence: {
			lanyardLog("Presence received", action.payload);

			if (Object.keys(action.payload).length === 0) return state;
			if (
				state.subscribed &&
				state.subscribed !== action.payload.discord_user.id
			)
				return state;

			localStorage.setItem(PRESENCE_KEY, JSON.stringify(action.payload));

			return {
				...state,
				presence: action.payload,
			};
		}

		case Events.subscribe: {
			lanyardLog("Subscribed to", action.payload);
			localStorage.setItem(KEY_ID, action.payload);

			return {
				...state,
				subscribed: action.payload,
			};
		}

		case Events.token: {
			lanyardLog("Token received");

			if (state.store) localStorage.setItem(KEY_TOKEN, action.payload);

			return {
				...state,
				token: action.payload,
			};
		}

		case Events.toggleStore: {
			lanyardLog("Toggled store");
			const nextStoreValue = !state.store;

			if (nextStoreValue) localStorage.setItem(KEY_TOKEN, state.token ?? "");
			else localStorage.removeItem(KEY_TOKEN);

			return {
				...state,
				store: nextStoreValue,
			};
		}

		default:
			return state;
	}
};

export const useLanyard = () => {
	const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

	const socket = useRef<WebSocket | null>(null);
	const heartbeat = useRef<ReturnType<typeof setInterval> | null>(null);
	const awaiting = useRef<Array<() => void>>([]);
	const subscribed = useRef<string | null>(null);
	const reconnect = useRef<ReturnType<typeof setTimeout> | null>(null);
	const unmounted = useRef(false);

	const clearHeartbeat = () => {
		if (!heartbeat.current) return;
		clearInterval(heartbeat.current);
		heartbeat.current = null;
	};

	const clearReconnect = () => {
		if (!reconnect.current) return;
		clearTimeout(reconnect.current);
		reconnect.current = null;
	};

	const resolveAwaiting = () => {
		for (const resolve of awaiting.current) resolve();
		awaiting.current = [];
	};

	const waitUntilConnected = () => {
		if (socket.current?.readyState === WebSocket.OPEN) return Promise.resolve();

		return new Promise<void>((resolve) => {
			awaiting.current.push(resolve);
		});
	};

	const send = async (data: SocketMessageSend, force = false) => {
		if (!force && socket.current?.readyState !== WebSocket.OPEN) {
			await waitUntilConnected();
		}

		if (!socket.current || socket.current.readyState !== WebSocket.OPEN) {
			throw new Error(Errors.socketNotReady);
		}

		socketLog("Sending", data);
		socket.current.send(stringify(data));
	};

	const subscribe = async (user: string, resubscribe = false) => {
		if (!USER_REGEX.test(user)) throw new Error(Errors.notFound);
		if (
			!resubscribe &&
			state.subscribed === user &&
			socket.current?.readyState === WebSocket.OPEN
		)
			return;

		const response = await fetch(`${LANYARD_BASE_URL}/users/${user}`);
		if (!response.ok) throw new Error(Errors.notFound);

		const { data } = (await response.json()) as { data: Presence };

		if (subscribed.current && !resubscribe) {
			await send({
				op: 4,
				d: {
					unsubscribe_from_id: subscribed.current,
				},
			});
		}

		if (!resubscribe) dispatch({ type: Events.subscribe, payload: user });

		dispatch({ type: Events.presence, payload: data });

		await send({
			op: 2,
			d: {
				subscribe_to_id: user,
			},
		});
	};

	const setToken = (token: string) => {
		dispatch({ type: Events.token, payload: token });
	};

	const toggleStore = () => {
		dispatch({ type: Events.toggleStore });
	};

	const kvValidate = (key: string, data?: string) => {
		if (key === "") throw new Error("Key cannot be empty");
		if (key.length > KEY_MAX_LENGTH)
			throw new Error(`Key cannot be longer than ${KEY_MAX_LENGTH} characters`);
		if (!KEY_REGEX.test(key))
			throw new Error("Key must be an alphanumeric string with underscores");
		if (data && data.length > VALUE_MAX_LENGTH)
			throw new Error(`Value cannot be longer than ${VALUE_MAX_LENGTH}`);
	};

	const kvApi = async (method: KVMethod, path: string, body?: string) => {
		if (!state.subscribed) throw new Error("Not subscribed");
		if (!state.token) throw new Error("No token");

		const key = decodeURIComponent(path.replace(/^\//, ""));
		const keys = state.presence?.kv ?? {};
		const isNewKey = method === "PUT" && key !== "" && !(key in keys);

		if (isNewKey && Object.keys(keys).length >= MAX_KEYS_AMOUNT) {
			throw new Error("You have reached the maximum amount of keys");
		}

		const response = await fetch(
			`${LANYARD_BASE_URL}/users/${state.subscribed}/kv${path}`,
			{
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: state.token,
				},
				body,
			},
		);

		if (response.ok) return;

		switch (response.status) {
			case 401:
			case 403:
				throw new Error("Invalid token");

			case 404:
				throw new Error("Key not found");

			default:
				throw new Error("Unknown error");
		}
	};

	const heartbeatSend = () => {
		socketLog("Heartbeat");
		void send({ op: 3 }, true);
	};

	const connect = (delay = 0) => {
		if (socket.current || unmounted.current) return;

		const currentSocket = new WebSocket(SOCKET_URL);
		currentSocket.binaryType = "arraybuffer";
		socket.current = currentSocket;
		if (!PRODUCTION) window.socket = currentSocket;

		const cleanupSocket = () => {
			clearHeartbeat();

			if (window.socket === currentSocket) delete window.socket;
			if (socket.current === currentSocket) socket.current = null;
		};

		const scheduleReconnect = () => {
			if (unmounted.current) return;

			clearReconnect();

			const waitTime = delay === 0 ? RECONNECT_INTERVAL : delay;
			const nextDelay = Math.min(
				waitTime + RECONNECT_INTERVAL,
				MAX_RECONNECT_TIME,
			);

			reconnect.current = setTimeout(() => {
				reconnect.current = null;
				connect(nextDelay);
			}, waitTime);
		};

		const handleOpen = (event: Event) => {
			dispatch({ type: Events.open });
			resolveAwaiting();

			if (subscribed.current) {
				socketLog("Resubscribing to", subscribed.current);
				void subscribe(subscribed.current, true);
			}

			socketLog("Connected:", event);
		};

		const handleClose = (event: CloseEvent) => {
			socketLog("Closed:", event);
			cleanupSocket();
			dispatch({ type: Events.close });
			scheduleReconnect();
		};

		const handleError = (event: Event) => {
			socketLog("Error", event);
			currentSocket.close();
		};

		const handleMessage = (event: MessageEvent<ArrayBuffer | string>) => {
			const data = parse<SocketMessageReceive>(event.data);

			switch (data.op) {
				case 0: {
					if (data.t === "INIT_STATE" || data.t === "PRESENCE_UPDATE") {
						dispatch({
							type: Events.presence,
							payload: data.d,
						});
					}
					break;
				}

				case 1: {
					clearHeartbeat();
					heartbeat.current = setInterval(
						heartbeatSend,
						data.d.heartbeat_interval,
					);
					break;
				}

				default:
					break;
			}
		};

		currentSocket.addEventListener("open", handleOpen);
		currentSocket.addEventListener("close", handleClose);
		currentSocket.addEventListener("message", handleMessage);
		currentSocket.addEventListener("error", handleError);
	};

	useEffect(() => {
		unmounted.current = false;
		connect();

		return () => {
			unmounted.current = true;
			clearReconnect();
			clearHeartbeat();
			socket.current?.close();
			socket.current = null;

			if (window.socket) delete window.socket;
		};
	}, []);

	useEffect(() => {
		subscribed.current = state.subscribed;
	}, [state.subscribed]);

	return {
		presence: state.presence,
		connecting: !state.connected,
		subscribed: state.subscribed,
		store: state.store,
		token: state.token,
		subscribe,
		setToken,
		kvApi,
		kvValidate,
		toggleStore,
	};
};
