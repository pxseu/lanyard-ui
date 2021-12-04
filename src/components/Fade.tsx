import styled, { keyframes } from "styled-components";

const Animation = keyframes`
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
`;

const Fade = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	animation: ${Animation} 0.3s ease-in-out;
	animation-fill-mode: forwards;
`;

export default Fade;
