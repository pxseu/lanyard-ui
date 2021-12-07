/* eslint-disable @typescript-eslint/indent */
import { FC, useContext, useEffect, useReducer } from "react";
import styled from "styled-components";
import { FaRegCheckCircle, FaTrash, FaUndo } from "react-icons/fa";
import { AppContext } from "App";
import { ErrorText, Input } from "components/Common";

const KVWrapper = styled.div`
	display: flex;
	flex-direction: column;
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

const KVButton = styled.button<{ show?: boolean; hoverColors?: string }>`
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
	transition: color 0.2s ease-in-out;

	&:focus {
		display: "initial";
		${({ hoverColors }) => hoverColors && `color: ${hoverColors};`}
		outline: 2px solid ${({ theme }) => theme.colors.outline};
	}

	&:hover {
		${({ hoverColors }) => hoverColors && `color: ${hoverColors};`}
	}
`;

const Row = styled.div`
	flex: 1;
	display: flex;
	flex-direction: row;
	width: 100%;
	justify-content: center;
	align-items: center;
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
	error: string | null;
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
	  }
	| {
			type: "error";
			payload: string;
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
			if (state.initialKey === "" && state.initialValue === "")
				return {
					...state,
					sending: false,
					delete: false,
					error: null,
					key: "",
					value: "",
				};

			return {
				...state,
				sending: false,
				delete: false,
				error: null,
			};

		case "error":
			return {
				...state,
				sending: false,
				delete: false,
				error: action.payload,
				key: state.initialKey,
				value: state.initialValue,
			};

		case "edit_reset":
			return {
				...state,
				key: state.initialKey,
				value: state.initialValue,
				editing: false,
			};

		case "edit_done": {
			return {
				...state,
				editing: false,
				sending: true,
			};
		}

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
				error: null,
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
		error: null,
	});

	const { request } = useContext(AppContext);

	const onKeyDown = (e: React.KeyboardEvent<HTMLElement>, cb?: () => void) => {
		if (e.key === "Enter") {
			cb?.();
		}
	};

	useEffect(() => {
		if (!state.sending) return;

		let mounted = true;

		if (state.delete && state.initialKey) {
			request("DELETE", state.initialKey).then(
				() => mounted && dispatch({ type: "request_done" }),
				(e) => mounted && dispatch({ type: "error", payload: e.message }),
			);
		} else {
			if (state.initialKey && state.key !== state.initialKey) {
				Promise.all([request("PUT", state.key, state.value), request("DELETE", state.initialKey)]).then(
					() => mounted && dispatch({ type: "request_done" }),
					(e) => mounted && dispatch({ type: "error", payload: e.message }),
				);
			} else {
				request("PUT", state.key, state.value).then(
					() => mounted && dispatch({ type: "request_done" }),
					(e) => mounted && dispatch({ type: "error", payload: e.message }),
				);
			}
		}

		return () => {
			mounted = false;
		};
	}, [state.delete, state.sending]);

	const editingDone = () => state.editing && dispatch({ type: "edit_done" });
	const deleteValue = () => dispatch({ type: "delete" });
	const reset = () => state.editing && dispatch({ type: "edit_reset" });

	return (
		<KVWrapper
			onMouseEnter={() => dispatch({ type: "hover" })}
			onMouseLeave={() => dispatch({ type: "hover_out" })}
		>
			<Row>
				<KVInputWrapper>
					<Input
						value={state.key}
						onChange={(e) => dispatch({ type: "set_key", payload: e.target.value })}
						placeholder="key"
						required={state.editing}
						disabled={state.sending}
						onKeyDown={(e) => onKeyDown(e, editingDone)}
					/>
				</KVInputWrapper>

				<KVInputWrapper>
					<Input
						value={state.value}
						onChange={(e) => dispatch({ type: "set_value", payload: e.target.value })}
						placeholder="value"
						required={state.editing}
						disabled={state.sending}
						onKeyDown={(e) => onKeyDown(e, editingDone)}
					/>
				</KVInputWrapper>

				<KVButton onClick={reset} onKeyDown={(e) => onKeyDown(e, reset)} show={state.editing}>
					<FaUndo />
				</KVButton>

				<KVButton
					onClick={editingDone}
					onKeyDown={(e) => onKeyDown(e, editingDone)}
					show={state.editing}
					hoverColors="#34a534"
				>
					<FaRegCheckCircle />
				</KVButton>

				<KVButton
					onClick={deleteValue}
					onKeyDown={(e) => onKeyDown(e, deleteValue)}
					show={(state.editing || state.hover) && !!state.initialKey}
					hoverColors="#a53434"
				>
					<FaTrash />
				</KVButton>
			</Row>
			{state.error && (
				<Row>
					<ErrorText>Error: {state.error}</ErrorText>
				</Row>
			)}
		</KVWrapper>
	);
};

export default KVElement;
