/* eslint-disable @typescript-eslint/indent */
import { useAppContext } from "hooks/useAppContext";
import { FC, useEffect, useReducer } from "react";
import styled from "styled-components";
import { getId } from "utils/getCached";
import { ErrorText, Input, Wrapper } from "./Common";

const InputTitle = styled.h2`
	font-size: 1.5rem;
	margin-bottom: 0.5rem;
`;

const DataInput = styled(Input)`
	max-width: 300px;
	background-color: ${({ theme }) => theme.colors.background};
`;

const CheckboxSpan = styled.span`
	margin-top: 0.2rem;
	font-size: 1.1rem;
`;

const Checkbox = styled.input`
	margin-left: 0.3rem;
	width: 1.2rem;
	height: 1.2rem;
	vertical-align: middle;
	border-radius: 5px;
	padding: 5px;
	transition: outline 0.05s ease-in-out;

	&:focus {
		outline: 2px solid ${({ theme }) => theme.colors.outline};
	}
`;

const InputGroup = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 2px 0;
	padding: 5px;
	border-radius: 5px;
	width: 100%;
`;

interface State {
	id: string;
	show: boolean;
	error: null | { field: string; message: string };
}

type Action =
	| {
			type: "set_id" | "set_token";
			payload: string;
	  }
	| {
			type: "toggle_store" | "toggle_show" | "clear_error";
	  }
	| {
			type: "set_error";
			payload: { field: "id" | "token"; message: string };
	  };

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "set_id": {
			return {
				...state,
				id: action.payload,
			};
		}

		case "toggle_show":
			return {
				...state,
				show: !state.show,
			};

		case "set_error":
			return {
				...state,
				error: action.payload,
			};

		case "clear_error":
			return {
				...state,
				error: null,
			};

		default: {
			return state;
		}
	}
};

const Landing: FC = () => {
	const [state, dispatch] = useReducer(reducer, {
		id: getId(),
		show: false,
		error: null,
	});

	const context = useAppContext();

	useEffect(() => {
		dispatch({ type: "clear_error" });
		if (!state.id) return;

		let mounted = true;

		const timeout = setTimeout(() => {
			context.subscribe(state.id).then(
				() => {},
				(reason) =>
					mounted && dispatch({ type: "set_error", payload: { field: "id", message: reason.message } }),
			);
		}, 200);

		return () => {
			mounted = false;
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
				{state.error && state.error.field === "id" && <ErrorText>Error: {state.error.message}</ErrorText>}
			</InputGroup>
			<InputGroup>
				<InputTitle>Lanyard api token:</InputTitle>
				<DataInput
					name="token"
					type={state.show ? "text" : "password"}
					autoComplete="token"
					value={context.token ?? ""}
					onChange={(e) => context.setToken(e.target.value)}
				/>
				{state.error && state.error.field === "token" && <ErrorText>Error: {state.error.message}</ErrorText>}
				<CheckboxSpan>
					<label htmlFor="show-token">Show token:</label>
					<Checkbox
						name="show-token"
						type="checkbox"
						checked={state.show}
						onChange={() => dispatch({ type: "toggle_show" })}
					/>
				</CheckboxSpan>
				<CheckboxSpan>
					<label htmlFor="store-token">Keep token stored:</label>
					<Checkbox
						name="store-token"
						type="checkbox"
						checked={context.store}
						onChange={() => context.toggleStore()}
					/>
				</CheckboxSpan>
			</InputGroup>
		</Wrapper>
	);
};
export default Landing;
