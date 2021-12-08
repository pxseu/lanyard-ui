/* eslint-disable @typescript-eslint/indent */
import { useEffect, useReducer, useRef } from "react";
import type { Presance, SocketMessageRecieve, SocketMessageSend } from "lanyard";
import { logger } from "utils/log";
import {
	KEY_ID,
	PRESANCE_KEY,
	SOCKET_URL,
	USER_REGEX,
	LANYARD_BASE_URL,
	KEY_REGEX,
	VALUE_MAX_LENGTH,
} from "utils/consts";
import { parse, stringify } from "utils/parse";

enum Events {
	presance = "presance",
	open = "open",
	close = "close",
	reconnect = "init",
	subscribe = "subscribe",
	token = "token",
}

enum Errors {
	notFound = "Could not find this user",
}

interface State {
	presance: Presance | null;
	connected: boolean;
	subscibed: string | null;
	token: string | null;
}

type Action =
	| {
			type: Events.open;
	  }
	| {
			type: Events.close;
	  }
	| {
			type: Events.presance;
			payload: Presance;
	  }
	| {
			type: Events.subscribe;
			payload: string;
	  }
	| {
			type: Events.token;
			payload: string;
	  };

const socketLog = logger("Socket");
const lanyardLog = logger("Lanyard");

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
			// FIXME: Unsubsribe ability?
			if (state.subscibed && state.subscibed !== action.payload.discord_user.id) return state;

			socketLog("Presance recieved", action.payload);
			localStorage.setItem(PRESANCE_KEY, JSON.stringify(action.payload));

			return {
				...state,
				presance: action.payload,
			};
		}

		case Events.subscribe: {
			lanyardLog("Subscibed to", action.payload);

			return {
				...state,
				subscibed: action.payload,
			};
		}

		case Events.token: {
			lanyardLog("Token recieved");

			return {
				...state,
				token: action.payload,
			};
		}

		default:
			return state;
	}
};

const getLastPresance = () => {
	const id = localStorage.getItem(KEY_ID);

	if (!id) return null;

	return JSON.parse(localStorage.getItem(PRESANCE_KEY) ?? "null") as Presance | null;
};

export const useLanyard = () => {
	const [state, dispatch] = useReducer(reducer, {
		presance: getLastPresance(),
		connected: false,
		subscibed: null,
		token: null,
	});

	const socket = useRef<WebSocket | null>(null);
	const heartbeat = useRef<NodeJS.Timeout | null>(null);
	const awaiting = useRef<((value: unknown) => void)[]>([]);
	const subscribed = useRef<string | null>(null);

	const waitUntilConnected = () =>
		new Promise((resolve) => {
			if (state.connected) return;

			awaiting.current.push(resolve);
		});

	const send = async (data: SocketMessageSend, force: boolean = false) => {
		if (!state.connected && !force) await waitUntilConnected();

		socketLog("Sending", data);

		const message = stringify(data);

		socket.current!.send(message);
	};

	const subscribe = async (user: string) => {
		if (state.subscibed === user && socket.current) return;

		if (!USER_REGEX.test(user)) throw new Error(Errors.notFound);

		try {
			const res = await fetch(`${LANYARD_BASE_URL}/users/${user}`);
			if (!res.ok) throw new Error(Errors.notFound);
		} catch (error) {
			throw error;
		}

		dispatch({ type: Events.subscribe, payload: user });

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

	type Request = ((method: "PUT", key: string, data: string) => Promise<void>) &
		((method: "DELETE", key: string) => Promise<void>);

	const request: Request = async (method: "PUT" | "DELETE", key: string, data?: string) => {
		if (!state.subscibed) throw new Error("Not subscibed");
		if (!state.token) throw new Error("No token");
		if (!KEY_REGEX.test(key)) throw new Error("No or invalid key was provided");
		if (data && data.length > VALUE_MAX_LENGTH) throw new Error(`Value cannpt be longer than ${VALUE_MAX_LENGTH}`);

		const res = await fetch(`${LANYARD_BASE_URL}/users/${state.subscibed}/kv/${key}`, {
			method,
			headers: {
				Authorization: state.token,
			},
			body: data,
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

	const connect = () => {
		if (!socket.current) {
			socket.current = new WebSocket(SOCKET_URL);
			socket.current.binaryType = "arraybuffer";

			// @ts-expect-error lol
			window.socket = socket.current;
		}

		const handleOpen = (event: Event) => {
			dispatch({ type: Events.open });

			console.log(state.subscibed);

			// if a user was subscibed before we assume it was a reconnect
			if (subscribed.current) {
				socketLog("Resubscibing to", subscribed.current);
				subscribe(subscribed.current);
			}

			if (awaiting.current.length) {
				for (const resolve of awaiting.current) resolve(null);
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

			connect();
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
		presance: state.presance,
		connecting: !state.connected,
		subscribe,
		setToken,
		request,
		subscribed: state.subscibed,
	};
};
