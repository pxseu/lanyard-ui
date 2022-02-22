import { FC, useEffect, useReducer, useRef } from "react";
import styled from "styled-components";
import { FaRegCheckCircle, FaTrash, FaUndo } from "react-icons/fa";
import { ElementWrapper, ErrorText, Input, MotionButton, TextArea } from "components/Common";
import { useAppContext } from "hooks/useContexts";
import { motion, AnimatePresence, Variants } from "framer-motion";

const KVInputWrapper = styled.span`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	width: 100%;
	margin: 5px;
	transition: width 0.3s ease-in-out;
`;

const KVButton = styled(MotionButton)<{ show?: boolean; hovercolors?: string }>`
	width: 45px;
	margin-left: 8px;
	padding: 8px;
	transition: color 0.1s ease-in-out, outline 0.05s ease-in-out;

	&:focus {
		${({ hovercolors: hoverColors }) => hoverColors && `color: ${hoverColors};`}
		outline: 2px solid ${({ theme }) => theme.colors.outline};
	}

	&:hover {
		${({ hovercolors: hoverColors }) => hoverColors && `color: ${hoverColors};`}
	}
`;

const Row = styled(motion.div)<{ flexgrow?: "1" | "0" }>`
	${({ flexgrow: flex }) => flex === "1" && "flexGrow: 1; width: 100%;"}
	display: flex;
	flex-direction: row;
	padding: 4px 0;
	justify-content: space-between;
	align-items: center;
`;

const Collumn = styled(Row)`
	padding: 0;
	height: 100%;
	flex-direction: column;
	justify-content: flex-start;
`;

const CenterCollumn = styled(Collumn)`
	justify-content: center;
	align-items: center;
	gap: 7px;
`;

interface State {
	initialKey: string;
	key: string;
	initialValue: string;
	value: string;
	sending: boolean;
	editing: boolean;
	delete: boolean;
	mouseHover: boolean;
	focused: boolean;
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
			type: "hover" | "hover_out" | "focus" | "blur";
	  }
	| {
			type: "error";
			payload: string | null;
	  };

const buttonVariants: Variants = {
	initial: {
		opacity: 0,
		scale: 0.2,
	},
	hover: {
		opacity: 1,
		scale: 1,
		display: "flex",
	},
};

const isInitialToState = (state: State, action: Action): boolean => {
	switch (action.type) {
		case "set_key":
			return state.initialKey === action.payload && state.initialValue === state.value;
		case "set_value":
			return state.initialValue === action.payload && state.initialKey === state.key;
		default:
			return false;
	}
};

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case "set_key":
			if (!isInitialToState(state, action))
				return {
					...state,
					key: action.payload,
					editing: true,
				};

			return {
				...state,
				key: action.payload,
				editing: false,
			};

		case "set_value":
			if (!isInitialToState(state, action))
				return {
					...state,
					value: action.payload,
					editing: true,
				};

			return {
				...state,
				value: action.payload,
				editing: false,
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
					editing: false,
					sending: false,
					delete: false,
					error: null,
					key: "",
					value: "",
				};

			return {
				...state,
				editing: false,
				sending: false,
				delete: false,
				error: null,
				initialKey: state.key,
				initialValue: state.value,
			};

		case "error":
			return {
				...state,
				sending: false,
				delete: false,
				error: action.payload,
				// key: state.initialKey,
				// value: state.initialValue,
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
				editing: true,
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
				mouseHover: true,
			};

		case "hover_out":
			if (state.focused)
				return {
					...state,
					mouseHover: false,
				};

			return {
				...state,
				hover: false,
				mouseHover: false,
				error: null,
			};

		case "focus":
			return {
				...state,
				hover: true,
				focused: true,
			};

		case "blur":
			if (state.mouseHover)
				return {
					...state,
					focused: false,
				};

			return {
				...state,
				hover: false,
				focused: false,
			};

		default:
			return state;
	}
};

type KVElementProps = Parameters<typeof ElementWrapper>[0] & { data: [string, string] };

const KVElement: FC<KVElementProps> = ({ data, ...props }) => {
	const [state, dispatch] = useReducer(reducer, {
		initialKey: data[0],
		key: data[0],
		initialValue: data[1],
		value: data[1],
		mouseHover: false,
		sending: false,
		editing: false,
		delete: false,
		hover: false,
		error: null,
		focused: false,
	});

	const { kvApi, kvValidate } = useAppContext();
	const wrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!state.sending) return;

		let mounted = true;

		async function makeRequest() {
			// if there is a initial key and action is delete we send a delete request
			if (state.delete && state.initialKey) return kvApi("DELETE", `/${encodeURIComponent(state.initialKey)}`);

			// TODO: ask for patch method so i dont have to do this stupid shit x
			if (state.initialKey && state.key !== state.initialKey)
				return Promise.all([
					kvApi("DELETE", `/${encodeURIComponent(state.initialKey)}`),
					kvApi("PUT", `/${encodeURIComponent(state.key)}`, state.value),
				]);

			// if nothing matches we assume it's new and send a put request
			return kvApi("PUT", `/${state.key}`, state.value);
		}

		// do state stuff
		void makeRequest().then(
			() => mounted && dispatch({ type: "request_done" }),
			(e) => mounted && dispatch({ type: "error", payload: e.message }),
		);

		return () => {
			mounted = false;
		};
	}, [state.delete, state.sending]);

	useEffect(() => {
		let mounted = true;
		let timeout: NodeJS.Timeout | null = null;

		const handleIn = () => {
			dispatch({ type: "focus" });
		};

		const handleOut = () =>
			(timeout = setTimeout(() => {
				if (wrapperRef.current && wrapperRef.current.contains(document.activeElement)) return;
				if (!mounted) return;
				dispatch({ type: "blur" });
			}, 0));

		wrapperRef.current?.addEventListener("focusin", handleIn);
		wrapperRef.current?.addEventListener("focusout", handleOut);

		return () => {
			mounted = false;
			if (timeout) clearTimeout(timeout);
			wrapperRef.current?.removeEventListener("focusin", handleIn);
			wrapperRef.current?.removeEventListener("focusout", handleOut);
		};
	}, [wrapperRef.current]);

	useEffect(() => {
		let mounted = true;

		if (!state.key || !state.value) return;

		try {
			kvValidate(state.key, state.value);
			if (mounted) dispatch({ type: "error", payload: null });
		} catch (e) {
			if (mounted && e instanceof Error) dispatch({ type: "error", payload: e.message });
		}

		return () => {
			mounted = false;
		};
	}, [state.key, state.value]);

	const onKeyDown = (event: React.KeyboardEvent<HTMLElement>, cb?: () => void) => {
		if (event.key === "Enter" && !event.shiftKey) {
			cb?.();
		}
	};

	const editingDone = () => state.editing && dispatch({ type: "edit_done" });
	const deleteValue = () => dispatch({ type: "delete" });
	const reset = () => state.editing && dispatch({ type: "edit_reset" });

	return (
		<ElementWrapper
			onMouseEnter={() => dispatch({ type: "hover" })}
			onMouseLeave={() => dispatch({ type: "hover_out" })}
			ref={wrapperRef}
			{...props}
		>
			<Collumn flexgrow="1">
				<KVInputWrapper>
					<Input
						value={state.key}
						onChange={(e) => dispatch({ type: "set_key", payload: e.target.value })}
						placeholder="key"
						required={state.editing}
						disabled={state.sending}
						onKeyDown={(e) => onKeyDown(e, editingDone)}
					/>
					<CenterCollumn>
						<AnimatePresence>
							{/* delete button */}
							{(state.editing || state.hover) && !!state.initialKey && !!state.initialValue && (
								<KVButton
									onClick={deleteValue}
									onKeyDown={(e) => onKeyDown(e, deleteValue)}
									hovercolors="#a53434"
									transition={{ duration: 0.2 }}
									variants={buttonVariants}
									initial="initial"
									animate="hover"
									exit="initial"
									key="kv__delete-button"
								>
									<FaTrash fontSize={20} />
								</KVButton>
							)}
						</AnimatePresence>
					</CenterCollumn>
				</KVInputWrapper>

				<KVInputWrapper>
					<TextArea
						value={state.value}
						onChange={(e) => dispatch({ type: "set_value", payload: e.target.value })}
						placeholder="value"
						required={state.editing}
						disabled={state.sending}
						onKeyDown={(e) => onKeyDown(e, editingDone)}
					/>
					<CenterCollumn>
						<AnimatePresence>
							{/* cancel button */}
							{state.editing && (
								<KVButton
									onClick={reset}
									onKeyDown={(e) => onKeyDown(e, reset)}
									hovercolors="#a59d34"
									transition={{ duration: 0.2 }}
									variants={buttonVariants}
									initial="initial"
									animate="hover"
									exit="initial"
									key="kv__edit-button"
								>
									<FaUndo fontSize={20} />
								</KVButton>
							)}

							{/* edit button */}
							{state.editing && (
								<KVButton
									onClick={editingDone}
									onKeyDown={(e) => onKeyDown(e, editingDone)}
									hovercolors="#34a534"
									transition={{ duration: 0.2 }}
									variants={buttonVariants}
									initial="initial"
									animate="hover"
									exit="initial"
									key="kv__submit-button"
								>
									<FaRegCheckCircle fontSize={20} />
								</KVButton>
							)}
						</AnimatePresence>
					</CenterCollumn>
				</KVInputWrapper>

				{state.error && <ErrorText>Error: {state.error}</ErrorText>}
			</Collumn>
		</ElementWrapper>
	);
};

export default KVElement;
