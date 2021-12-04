/* eslint-disable @typescript-eslint/indent */
import { FC, useContext, useEffect, useReducer } from "react";
import styled from "styled-components";
import { FaRegCheckCircle, FaTrash, FaUndo } from "react-icons/fa";
import { AppContext } from "App";

const KVWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	background-color: ${({ theme }) => theme.colors.background};
	margin-top: 5px;
	margin-bottom: 5px;
	padding: 10px;
	border-radius: 5px;
`;

const KVInputWrapper = styled.span`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	width: 100%;
	margin-left: 4px;
	margin-right: 4px;
	transition: width 0.3s ease-in-out;
`;

const KVInput = styled.input`
	width: 100%;
	flex: 1;
	border: none;
	background-color: ${({ theme }) => theme.colors.presance};
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

const KVButton = styled.button<{ show?: boolean }>`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	height: 100%;
	width: 40px;
	display: ${({ show }) => (show ? "inital" : "none")};
	${({ show }) => !show && "opacity: 0"}
	font-size: 1.2rem;
	margin-left: 5px;
	padding: 7px;
	background-color: ${({ theme }) => theme.colors.presance};
	color: ${({ theme }) => theme.colors.primary};
	border: none;
	transition: width 1s ease-in-out;

	&:focus {
		width: 40px;
		display: "initial";
	}
`;

interface State {
	initialKey: string;
	key: string;
	initialValue: string;
	value: string;
	sending: boolean;
	editing: boolean;
	delete: boolean;
	hover: boolean;
}

type Action =
	| {
			type: "set_key";
			payload: string;
	  }
	| {
			type: "set_value";
			payload: string;
	  }
	| {
			type: "initialize";
			payload: [string, string];
	  }
	| {
			type: "request_done";
	  }
	| {
			type: "edit_reset" | "edit_done" | "delete";
	  }
	| {
			type: "hover" | "hover_out";
	  };

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "set_key":
			if (action.payload !== state.key)
				return {
					...state,
					key: action.payload,
					editing: true,
				};

			return {
				...state,
				key: action.payload,
			};

		case "set_value":
			if (action.payload !== state.value)
				return {
					...state,
					value: action.payload,
					editing: true,
				};

			return {
				...state,
				value: action.payload,
			};

		case "initialize":
			return {
				...state,
				key: action.payload[0],
				value: action.payload[1],
				initialKey: action.payload[0],
				initialValue: action.payload[1],
			};

		case "request_done":
			return {
				...state,
				sending: false,
				delete: false,
			};

		case "edit_reset":
			return {
				...state,
				key: state.initialKey,
				value: state.initialValue,
				editing: false,
			};

		case "edit_done":
			return {
				...state,
				editing: false,
				sending: true,
			};

		case "delete":
			return {
				...state,
				sending: true,
				delete: true,
			};

		case "hover":
			return {
				...state,
				hover: true,
			};

		case "hover_out":
			return {
				...state,
				hover: false,
			};

		default:
			return state;
	}
};

const KVElement: FC<{ data: [string, string] }> = ({ data }) => {
	const [state, dispatch] = useReducer(reducer, {
		initialKey: data[0],
		key: data[0],
		initialValue: data[1],
		value: data[1],
		sending: false,
		editing: false,
		delete: false,
		hover: false,
	});

	const { request } = useContext(AppContext);

	useEffect(() => {
		if (!state.sending) return;

		let mounted = true;

		if (state.delete && !!state.initialKey) {
			request("DELETE", state.initialKey).then(() => mounted && dispatch({ type: "request_done" }));
		} else {
			if (state.initialKey && state.key !== state.initialKey) {
				Promise.all([request("PUT", state.key, state.value), request("DELETE", state.initialKey)]).then(
					() => mounted && dispatch({ type: "request_done" }),
				);
			} else {
				request("PUT", state.key, state.value).then(() => mounted && dispatch({ type: "request_done" }));
			}
		}

		return () => {
			mounted = false;
		};
	}, [state.delete, state.sending]);

	return (
		<KVWrapper
			onMouseEnter={() => dispatch({ type: "hover" })}
			onMouseLeave={() => dispatch({ type: "hover_out" })}
		>
			<KVInputWrapper>
				<KVInput
					value={state.key}
					onChange={(e) => dispatch({ type: "set_key", payload: e.target.value })}
					placeholder="key"
					required={state.editing}
					disabled={state.sending}
				/>
			</KVInputWrapper>

			<KVInputWrapper>
				<KVInput
					value={state.value}
					onChange={(e) => dispatch({ type: "set_value", payload: e.target.value })}
					placeholder="value"
					required={state.editing}
					disabled={state.sending}
				/>
			</KVInputWrapper>

			<KVButton onClick={() => dispatch({ type: "edit_reset" })} show={state.editing}>
				<FaUndo />
			</KVButton>

			<KVButton onClick={() => dispatch({ type: "edit_done" })} show={state.editing}>
				<FaRegCheckCircle />
			</KVButton>

			<KVButton
				onClick={() => dispatch({ type: "delete" })}
				show={(state.editing || state.hover) && !!state.initialKey}
			>
				<FaTrash />
			</KVButton>
		</KVWrapper>
	);
};

export default KVElement;
