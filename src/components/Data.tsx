/* eslint-disable @typescript-eslint/indent */
import { AppContext } from "App";
import { FC, useContext, useEffect, useReducer } from "react";
import styled from "styled-components";
import { KEY_ID, KEY_TOKEN } from "utils/consts";
import { Wrapper } from "./Common";

const InputTitle = styled.h2`
	font-size: 1.5rem;
	margin-bottom: 0.5rem;
`;

const DataInput = styled.input`
	width: 90%;
	max-width: 300px;
	flex: 1;
	border: none;
	background-color: ${({ theme }) => theme.colors.background};
	color: ${({ theme }) => theme.colors.primary};
	font-size: 1rem;
	padding: 10px;
	border-radius: 5px;

	&:focus {
		outline: 2px solid ${({ theme }) => theme.colors.outline};
	}

	&:disabled {
		color: ${({ theme }) => theme.colors.primary}aa;
	}
`;

const Checkbox = styled.input`
	margin-right: 0.5rem;
	&:focus {
		outline: 2px solid ${({ theme }) => theme.colors.outline};
	}
`;

const InputGroup = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	/* background-color: ${({ theme }) => theme.colors.background}; */
	margin: 2px 0;
	padding: 10px;
	border-radius: 5px;
	width: 100%;
`;

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

			if (value) localStorage.setItem(KEY_TOKEN, state.token);
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

const Landing: FC = () => {
	const [state, dispatch] = useReducer(reducer, {
		id: localStorage.getItem(KEY_ID) || "819287687121993768",
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
		<Wrapper>
			<InputGroup>
				<InputTitle>Discord Id:</InputTitle>
				<DataInput
					name="id"
					autoComplete="id"
					type="text"
					value={state.id}
					onChange={(e) => dispatch({ type: "set_id", payload: e.target.value })}
				/>
			</InputGroup>
			<InputGroup>
				<InputTitle>Lanyard api token:</InputTitle>
				<DataInput
					name="token"
					type={state.show ? "text" : "password"}
					autoComplete="token"
					value={state.token}
					onChange={(e) => dispatch({ type: "set_token", payload: e.target.value })}
				/>
				<span>
					Show token:{" "}
					<Checkbox type="checkbox" checked={state.show} onChange={() => dispatch({ type: "toggle_show" })} />
				</span>
				<span>
					Keep token stored:{" "}
					<Checkbox
						type="checkbox"
						checked={state.store}
						onChange={() => dispatch({ type: "toggle_store" })}
					/>
				</span>
			</InputGroup>
		</Wrapper>
	);
};
export default Landing;
