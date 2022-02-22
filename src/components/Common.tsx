import { motion } from "framer-motion";
import { FC } from "react";
import styled, { DefaultTheme, StyledComponentProps } from "styled-components";

export const Wrapper = styled.div`
	position: relative;
	margin-bottom: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: left;
	width: 90%;
	padding: 10px;
	border-radius: 10px;
	max-width: 600px;
	height: 100%;
	background-color: ${({ theme }) => theme.colors.presance};
	box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);

	&:focus {
		border-radius: 10px;
		outline: 2px solid ${({ theme }) => theme.colors.outline};
	}
`;

export const ErrorText = styled.span`
	color: ${({ theme }) => theme.colors.error};
	font-size: 1.2rem;
	text-align: center;
`;

const InputBase = styled.input`
	width: 100%;
	flex: 1;
	border: none;
	background-color: ${({ theme }) => theme.colors.presance};
	color: ${({ theme }) => theme.colors.primary};
	font-size: 1rem;
	padding: 10px;
	border-radius: 5px;
	transition: outline 0.05s ease-in-out;

	&:focus {
		outline: 2px solid ${({ theme }) => theme.colors.outline};
	}

	&:disabled {
		color: ${({ theme }) => theme.colors.primary}aa;
	}
`;

const TextAreaBase = styled.textarea`
	width: 100%;
	flex: 1;
	border: none;
	background-color: ${({ theme }) => theme.colors.presance};
	color: ${({ theme }) => theme.colors.primary};
	font-size: 1rem;
	padding: 10px;
	border-radius: 5px;
	transition: outline 0.05s ease-in-out;
	resize: vertical;
	min-height: 80px;

	&:focus {
		outline: 2px solid ${({ theme }) => theme.colors.outline};
	}

	&:disabled {
		color: ${({ theme }) => theme.colors.primary}aa;
	}
`;

export const TextArea: FC<StyledComponentProps<"textarea", DefaultTheme, { noSelect?: boolean }, never>> = ({
	noSelect,
	className,
	...props
}) => (
	<TextAreaBase
		className={`${InputBase.toString().substring(1)}${className ? ` ${className}` : ""}`}
		{...props}
		onFocus={(e) => {
			if (!noSelect) e.target.select();
			props?.onFocus?.(e);
		}}
	/>
);

export const Input: FC<StyledComponentProps<"input", DefaultTheme, { noSelect?: boolean }, never>> = ({
	noSelect,
	...props
}) => (
	<InputBase
		{...props}
		onFocus={(e) => {
			if (!noSelect) e.target.select();
			props?.onFocus?.(e);
		}}
	/>
);

export const Anchor = styled.a<{ elipsis?: boolean }>`
	display: inline-block;
	color: ${({ theme }) => theme.colors.primary};
	text-decoration: underline;
	cursor: pointer;
	transition: outline 0.05s ease-in-out;
	/* padding: 4px 0; */
	/* background-color: pink; */
	border-radius: 7px;
	outline-offset: -2px;
	${({ elipsis }) => elipsis && "text-overflow: ellipsis; overflow: hidden; white-space: nowrap; width: 100%"};

	&:focus {
		outline: 2px solid ${({ theme }) => theme.colors.outline};
		text-decoration: none;
	}
`;

export const Button = styled.button`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	margin: 0;
	padding: 5px 10px;
	border-radius: 5px;
	border: none;
	background-color: ${({ theme }) => theme.colors.presance};
	color: ${({ theme }) => theme.colors.primary};
	font-size: 1em;
	cursor: pointer;
	transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, outline 0.05s ease-in-out;

	/* box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2); */

	&:hover,
	&:focus {
		background-color: ${({ theme }) => theme.colors.presance};
		outline: 2px solid ${({ theme }) => theme.colors.outline};
		/* box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5); */
	}
`;

export const MotionButton = styled(motion.button)`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	margin: 0;
	height: 100%;
	padding: 5px 10px;
	border-radius: 5px;
	border: none;
	background-color: ${({ theme }) => theme.colors.presance};
	color: ${({ theme }) => theme.colors.primary};
	font-size: 1em;
	cursor: pointer;
	transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, outline 0.05s ease-in-out;

	/* box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2); */

	&:hover,
	&:focus {
		background-color: ${({ theme }) => theme.colors.presance};
		outline: 2px solid ${({ theme }) => theme.colors.outline};
		/* box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5); */
	}
`;

export const ElementWrapper = styled(motion.div)`
	display: flex;
	justify-content: space-between;
	width: 100%;
	background-color: ${({ theme }) => theme.colors.background};
	margin-top: 5px;
	margin-bottom: 5px;
	padding: 10px 14px;
	border-radius: 5px;
	overflow: hidden;
`;
