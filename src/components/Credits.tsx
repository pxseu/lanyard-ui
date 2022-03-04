import styled from "styled-components";
import { AUTHOR_URL, REPOSITORY_URL } from "utils/consts";
import { Anchor, Wrapper } from "./Common";

const Paragraph = styled.p`
	text-align: center;
`;

const Credits = () => (
	<Wrapper>
		<Paragraph>
			Created by{" "}
			<Anchor href={AUTHOR_URL} target="_blank" rel="noopener noreferrer">
				pxseu
			</Anchor>
			.
		</Paragraph>
		<Paragraph>
			The source code is available on{" "}
			<Anchor href={REPOSITORY_URL} target="_blank" rel="noopener noreferrer">
				GitHub
			</Anchor>
			.
		</Paragraph>
	</Wrapper>
);

export default Credits;
