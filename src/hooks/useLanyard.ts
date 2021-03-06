/* eslint-disable @typescript-eslint/indent */
import { useEffect, useReducer, useRef } from "react";
import type { Presence, SocketMessageRecieve, SocketMessageSend } from "lanyard";
import { logger } from "utils/log";
import {
	PRESANCE_KEY,
	SOCKET_URL,
	USER_REGEX,
	LANYARD_BASE_URL,
	KEY_REGEX,
	VALUE_MAX_LENGTH,
	KEY_ID,
	KEY_TOKEN,
	RECONNECT_INTERVAL,
	MAX_RECONNECT_TIME,
	KEY_MAX_LENGTH,
	MAX_KEYS_AMMOUNT,
} from "utils/consts";
import { parse, stringify } from "utils/parse";
import { getPresence, getToken } from "utils/getCached";

enum Events {
	presance = "presence",
	open = "open",
	close = "close",
	reconnect = "init",
	subscribe = "subscribe",
	token = "token",
	toggleStore = "toggleStore",
}

enum Errors {
	notFound = "Could not find this user",
}

interface State {
	presence: Presence | null;
	connected: boolean;
	subscibed: string | null;
	token: string | null;
	store: boolean;
}

type Action =
	| {
			type: Events.open | Events.close | Events.toggleStore;
	  }
	| {
			type: Events.presance;
			payload: Presence;
	  }
	| {
			type: Events.subscribe | Events.token;
			payload: string;
	  };

const socketLog = logger("info", "Socket", true);
const lanyardLog = logger("info", "Lanyard");

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

		case Events.presance: {
			lanyardLog("Presence recieved", action.payload);

			if (action.payload && Object.keys(action.payload).length === 0) return state;
			if (state.subscibed && state.subscibed !== action.payload.discord_user?.id) return state;

			localStorage.setItem(PRESANCE_KEY, JSON.stringify(action.payload));

			return {
				...state,
				presence: action.payload,
			};
		}

		case Events.subscribe: {
			lanyardLog("Subscibed to", action.payload);
			localStorage.setItem(KEY_ID, action.payload);

			return {
				...state,
				subscibed: action.payload,
			};
		}

		case Events.token: {
			lanyardLog("Token recieved");

			if (state.store) localStorage.setItem(KEY_TOKEN, action.payload);

			return {
				...state,
				token: action.payload,
			};
		}

		case Events.toggleStore: {
			lanyardLog("Toggled store");
			const value = !state.store;

			if (value) localStorage.setItem(KEY_TOKEN, state.token ?? "");
			else localStorage.removeItem(KEY_TOKEN);

			return {
				...state,
				store: value,
			};
		}

		default:
			return state;
	}
};

export const useLanyard = () => {
	const [state, dispatch] = useReducer(reducer, {
		presence: getPresence(),
		connected: false,
		subscibed: null,
		token: getToken(),
		store: !!(getToken() || true),
	});

	const socket = useRef<WebSocket | null>(null);
	const heartbeat = useRef<NodeJS.Timeout | null>(null);
	const awaiting = useRef<((value: unknown) => void)[]>([]);
	const subscribed = useRef<string | null>(null);
	const reconnect = useRef<NodeJS.Timeout | null>(null);

	const waitUntilConnected = () =>
		new Promise((resolve) => {
			awaiting.current.push(resolve);
		});

	const send = async (data: SocketMessageSend, force: boolean = false) => {
		if (!socket.current && !force) await waitUntilConnected();

		socketLog("Sending", data);

		const message = stringify(data);

		socket.current!.send(message);
	};

	const subscribe = async (user: string, resubscribe: boolean = false) => {
		if (!resubscribe && state.subscibed === user && socket.current) return;

		if (!USER_REGEX.test(user)) throw new Error(Errors.notFound);

		// fetch the user to check if they exist
		try {
			const res = await fetch(`${LANYARD_BASE_URL}/users/${user}`);
			if (!res.ok) throw new Error(Errors.notFound);

			// dispatch the presance via an async action
			res.json().then(({ data }) => dispatch({ type: Events.presance, payload: data }));
		} catch (error) {
			throw error;
		}

		// if a user is already subscribed, unsubscribe
		if (subscribed.current && !resubscribe)
			send({
				op: 4,
				d: {
					unsubscribe_from_id: subscribed.current,
				},
			});

		if (!resubscribe) dispatch({ type: Events.subscribe, payload: user });

		send({
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
		if (key.length > KEY_MAX_LENGTH) throw new Error(`Key cannot be longer than ${KEY_MAX_LENGTH} characters`);
		if (!KEY_REGEX.test(key)) throw new Error("Key must be an alphanumeric string with underscores");
		if (data && data.length > VALUE_MAX_LENGTH) throw new Error(`Value cannot be longer than ${VALUE_MAX_LENGTH}`);
	};

	type Request = ((method: "PUT", path: string, body: string) => Promise<void>) &
		((method: "PATCH", path: string, data: string) => Promise<void>) &
		((method: "DELETE", path: string) => Promise<void>);

	const kvApi: Request = async (method: "PUT" | "PATCH" | "DELETE", path: string, body?: any) => {
		if (!state.subscibed) throw new Error("Not subscibed");
		if (!state.token) throw new Error("No token");
		if (Object.entries(state.presence?.kv ?? {}).length >= MAX_KEYS_AMMOUNT)
			throw new Error("You have reached the maximum amount of keys");

		const res = await fetch(`${LANYARD_BASE_URL}/users/${state.subscibed}/kv${path}`, {
			method,
			headers: {
				"Content-Type": "application/json",
				Authorization: state.token,
			},
			body,
		});

		if (!res.ok)
			switch (res.status) {
				case 401:
				case 403:
					throw new Error("Invalid token");

				case 404:
					throw new Error("Key not found");

				default:
					throw new Error("Unknown error");
			}
		// return res.json();
	};

	const heartbeatSend = () => {
		socketLog("Heartbeat");

		send(
			{
				op: 3,
			},
			true,
		);
	};

	const connect = (timeout?: number) => {
		if (!socket.current) {
			socket.current = new WebSocket(SOCKET_URL);
			socket.current.binaryType = "arraybuffer";

			// @ts-expect-error lol
			window.socket = socket.current;
		}

		const handleOpen = (event: Event) => {
			dispatch({ type: Events.open });

			// if a user was subscibed before we assume it was a reconnect
			if (subscribed.current) {
				socketLog("Resubscibing to", subscribed.current);
				subscribe(subscribed.current, true);
			}

			if (awaiting.current.length) {
				for (const resolve of awaiting.current) resolve(void null);
				awaiting.current = [];
			}

			socketLog("Connected: ", event);
		};

		const handleClose = (event: CloseEvent | string) => {
			socketLog("Closed: ", event);

			if (socket.current) {
				socket.current.close();
				socket.current = null;
			}

			if (heartbeat.current) {
				clearInterval(heartbeat.current);
				heartbeat.current = null;
			}

			const time = timeout
				? timeout > MAX_RECONNECT_TIME
					? RECONNECT_INTERVAL + timeout
					: RECONNECT_INTERVAL
				: 0;

			reconnect.current = setTimeout(() => {
				reconnect.current = null;
				connect(timeout ?? RECONNECT_INTERVAL);
			}, time);
		};

		const handleError = (event: Event) => {
			socketLog("Error", event);
			return handleClose("error");
		};

		const handleMessage = (event: MessageEvent) => {
			const data = parse<SocketMessageRecieve>(event.data);

			switch (data.op) {
				case 0: {
					if (data.t === "INIT_STATE")
						return dispatch({
							type: Events.presance,
							payload: data.d,
						});

					if (data.t === "PRESENCE_UPDATE")
						return dispatch({
							type: Events.presance,
							payload: data.d,
						});

					break;
				}

				case 1: {
					heartbeat.current = setInterval(heartbeatSend, data.d.heartbeat_interval);
					break;
				}

				default: {
					break;
				}
			}
		};

		socket.current.addEventListener("open", handleOpen);
		socket.current.addEventListener("close", handleClose);
		socket.current.addEventListener("message", handleMessage);
		socket.current.addEventListener("error", handleError);
	};

	useEffect(() => {
		connect();

		return () => {
			socket.current?.close();
			socket.current = null;
			dispatch({ type: Events.close });
		};
	}, []);

	// stupid hack for state to be updated
	useEffect(() => {
		if (!state.subscibed) return;
		subscribed.current = state.subscibed;
	}, [state.subscibed]);

	return {
		presance: state.presence,
		connecting: !state.connected,
		subscribed: state.subscibed,
		store: state.store,
		token: state.token,
		subscribe,
		setToken,
		kvApi,
		kvValidate,
		toggleStore,
	};
};
