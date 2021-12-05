import styled from "styled-components";

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
