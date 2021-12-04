/* eslint-disable @typescript-eslint/indent */
import { AppContext } from "App";
import Fade from "components/Fade";
import { FC, useContext, useEffect, useReducer } from "react";
import { KEY_ID, KEY_TOKEN } from "utils/consts";

interface State {
	id: string;
	token: string;
	store: boolean;
	show: boolean;
}

type Action =
	| {
			type: "set_id";
			payload: string;
	  }
	| {
			type: "set_token";
			payload: string;
	  }
	| {
			type: "toggle_store";
	  }
	| {
			type: "toggle_show";
	  };

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "set_id": {
			localStorage.setItem(KEY_ID, action.payload);

			return {
				...state,
				id: action.payload,
			};
		}

		case "set_token": {
			if (state.store) localStorage.setItem(KEY_TOKEN, action.payload);

			return {
				...state,
				token: action.payload,
			};
		}
		case "toggle_show":
			return {
				...state,
				show: !state.show,
			};

		case "toggle_store": {
			const value = !state.store;

			if (!value) localStorage.removeItem(KEY_TOKEN);

			return {
				...state,
				store: value,
			};
		}

		default:
			return state;
	}
};

const Landing: FC = () => {
	const [state, dispatch] = useReducer(reducer, {
		id: localStorage.getItem(KEY_ID) ?? "819287687121993768",
		token: localStorage.getItem(KEY_TOKEN) ?? "",
		store: !!localStorage.getItem(KEY_TOKEN),
		show: false,
	});

	const context = useContext(AppContext);

	useEffect(() => {
		context.setToken(state.token);
	}, [state.token]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			context.subscribe(state.id).then(
				() => {},
				() => {},
			);
		}, 200);

		return () => {
			clearTimeout(timeout);
		};
	}, [state.id]);

	return (
		<Fade>
			<h2>Input your Discord user Id bellow:</h2>
			<input
				type="text"
				value={state.id}
				onChange={(e) => dispatch({ type: "set_id", payload: e.target.value })}
			/>
			<h2>Input your Lanyard api token bellow:</h2>
			<input
				type={state.show ? "text" : "password"}
				value={state.token}
				onChange={(e) => dispatch({ type: "set_token", payload: e.target.value })}
			/>
			<span>
				Keep token stored:{" "}
				<input type="checkbox" checked={state.store} onChange={() => dispatch({ type: "toggle_store" })} />
			</span>
		</Fade>
	);
};
export default Landing;
