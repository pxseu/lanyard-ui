/* eslint-disable @typescript-eslint/indent */
import { useEffect, useReducer, useRef } from "react";
import type { Presance, SocketMessageRecieve, SocketMessageSend } from "lanyard";
import { logger } from "utils/log";
import { KEY_ID, PRESANCE_KEY } from "utils/consts";

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
	reconnect: boolean;
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
			type: Events.reconnect;
	  }
	| {
			type: Events.subscribe;
			payload: string;
	  }
	| {
			type: Events.token;
			payload: string;
	  };

const USER_REGEX = /^\d{17,}$/;

const socketLog = (...args: any[]) => logger("Socket", ...args);
const lanyardLog = (...args: any[]) => logger("Lanyard", ...args);

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
				reconnect: true,
			};
		}
		case Events.presance: {
			socketLog("Presance recieved", action.payload);
			localStorage.setItem(PRESANCE_KEY, JSON.stringify(action.payload));

			return {
				...state,
				presance: action.payload,
			};
		}
		case Events.reconnect: {
			socketLog("Reconnecting");

			return {
				...state,
				connected: true,
				reconnect: false,
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
		reconnect: false,
		subscibed: null,
		token: null,
	});

	const socket = useRef<WebSocket | null>(null);
	const heartbeat = useRef<NodeJS.Timeout | null>(null);
	const awaiting = useRef<((value: unknown) => void)[]>([]);

	const waitUntilConnected = () =>
		new Promise((resolve) => {
			if (state.connected) return;

			awaiting.current.push(resolve);
		});

	const send = async (data: SocketMessageSend, force: boolean = false) => {
		if (!state.connected && !force) await waitUntilConnected();

		socketLog("Sending", data);

		socket.current!.send(JSON.stringify(data));
	};

	const subscribe = async (user: string) => {
		if (state.subscibed === user && !state.reconnect) return;

		if (!USER_REGEX.test(user)) throw new Error(Errors.notFound);

		try {
			const res = await fetch(`https://lanyard.rest/v1/users/${user}`);
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
		if (!key) throw new Error("No key provided");

		const res = await fetch(`https://api.lanyard.rest/v1/users/${state.subscibed}/kv/${key}`, {
			method,
			headers: {
				Authorization: state.token,
			},
			body: data,
		});

		if (!res.ok) throw new Error(res.statusText);

		// return res.json();
	};

	const handleOpen = (event: Event) => {
		dispatch({ type: Events.open });

		if (state.reconnect && state.subscibed) {
			socketLog("Resubscibing to", state.subscibed);
			subscribe(state.subscibed);
		}

		if (awaiting.current.length) {
			awaiting.current.forEach((fn) => fn(null));
			awaiting.current = [];
		}

		socketLog("Connected: ", event);
	};

	const handleClose = (event: CloseEvent) => {
		socketLog("Closed: ", event);
		socket.current?.close();
		socket.current = null;
		heartbeat.current = null;
		dispatch({ type: Events.reconnect });
	};

	const handleError = (event: Event) => {
		socketLog("Error", event);
		socket.current?.close();
		socket.current = null;
		heartbeat.current = null;
		dispatch({ type: Events.reconnect });
	};

	const handleMessage = (event: MessageEvent) => {
		const data: SocketMessageRecieve = JSON.parse(event.data);

		switch (data.op) {
			case 0: {
				if (data.t === "INIT_STATE") {
					return dispatch({
						type: Events.presance,
						payload: data.d,
					});
				}

				if (data.t === "PRESENCE_UPDATE") {
					// @ts-ignore
					delete data.d.user_id;

					return dispatch({
						type: Events.presance,
						payload: data.d,
					});
				}

				break;
			}

			case 1: {
				heartbeat.current = setInterval(() => {
					// we assume that the socket is still open
					send({ op: 3 }, true);
				}, data.d.heartbeat_interval);
				break;
			}

			default: {
				break;
			}
		}
	};

	const connect = () => {
		if (socket.current) return;

		socket.current = new WebSocket("wss://lanyard.rest/socket");
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

	useEffect(() => {
		if (!state.connected && state.reconnect) {
			connect();
		}
	}, [state.connected, state.reconnect]);

	return { presance: state.presance, connecting: !state.connected, subscribe, setToken, request };
};
