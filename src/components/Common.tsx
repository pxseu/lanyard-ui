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
	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
`;

export const ErrorText = styled.span`
	color: ${({ theme }) => theme.colors.error};
	font-size: 1.2rem;
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

export const Anchor = styled.a`
	display: inline-block;
	color: ${({ theme }) => theme.colors.primary};
	text-decoration: underline;
	cursor: pointer;
	transition: outline 0.05s ease-in-out;
	padding: 4px 0;
	/* background-color: pink; */
	border-radius: 7px;
	outline-offset: -2px;

	&:focus {
		padding: 4px;
		outline: 2px solid ${({ theme }) => theme.colors.outline};
		text-decoration: none;
	}
`;
