/* eslint-disable @typescript-eslint/indent */
import { useAppContext } from "hooks/useAppContext";
import { FC, useEffect, useReducer } from "react";
import styled from "styled-components";
import { getId } from "utils/getCached";
import { ErrorText, Input, Wrapper } from "./Common";

const InputTitle = styled.label`
	font-weight: bold;
	font-size: 1.5rem;
	margin-bottom: 0.5rem;
	text-align: center;
`;

const DataInput = styled(Input)`
	max-width: 300px;
	background-color: ${({ theme }) => theme.colors.background};
	box-shadow: 0 5px 4px rgba(0, 0, 0, 0.15);
`;

const CheckboxSpan = styled.span`
	margin-top: 0.2rem;
	font-size: 1.1rem;
`;

const Checkbox = styled.input`
	margin-left: 0.3rem;
	width: 1.5rem;
	height: 1.5rem;
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
			<form action="" onSubmit={(e) => e.preventDefault()}>
				<InputGroup>
					<InputTitle htmlFor="discord-id">Discord Id:</InputTitle>
					<DataInput
						id="discord-id"
						name="discord-id"
						autoComplete="discord-id"
						type="text"
						value={state.id}
						onChange={(e) => dispatch({ type: "set_id", payload: e.target.value })}
					/>
					{state.error && state.error.field === "id" && <ErrorText>Error: {state.error.message}</ErrorText>}
				</InputGroup>
				<InputGroup>
					<InputTitle htmlFor="lanyard-token">Lanyard api token:</InputTitle>
					<DataInput
						id="lanyard-token"
						name="lanyard-token"
						type={state.show ? "text" : "password"}
						autoComplete="lanyard-token"
						value={context.token ?? ""}
						onChange={(e) => context.setToken(e.target.value)}
					/>
					{state.error && state.error.field === "token" && (
						<ErrorText>Error: {state.error.message}</ErrorText>
					)}
				</InputGroup>
				<InputGroup>
					<CheckboxSpan>
						<label htmlFor="show-token">Show token:</label>
						<Checkbox
							id="show-token"
							name="show-token"
							type="checkbox"
							checked={state.show}
							onChange={() => dispatch({ type: "toggle_show" })}
						/>
					</CheckboxSpan>
					<CheckboxSpan>
						<label htmlFor="store-token">Keep token stored:</label>
						<Checkbox
							id="store-token"
							name="store-token"
							type="checkbox"
							checked={context.store}
							onChange={() => context.toggleStore()}
						/>
					</CheckboxSpan>
				</InputGroup>
			</form>
		</Wrapper>
	);
};
export default Landing;
