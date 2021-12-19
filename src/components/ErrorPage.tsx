import { FC } from "react";
import styled from "styled-components";
import { REPOSITORY_URL } from "utils/consts";
import Center from "./Center";
import { Anchor, Button, Wrapper } from "./Common";
import Credits from "./Credits";

const Title = styled.h1`
	font-size: 1.5rem;
	font-weight: normal;
	margin: 0;
	text-align: center;
	margin-bottom: 10px;
`;

const Paragraph = styled.p`
	text-align: center;
	margin-bottom: 10px;
	text-align: center;
`;

const Code = styled.code`
	display: inline-block;
	font-size: 1em;
	color: ${({ theme }) => theme.colors.primary};
	background-color: ${({ theme }) => theme.colors.background};
	padding: 2px 5px;
	border-radius: 5px;
`;

const ErrorPage: FC<{ error: unknown }> = ({ error }) => {
	const errorMessage = (error instanceof Error ? error.message : error) || "Unknown error";

	const handleClick = () => {
		localStorage.clear();
		window.location.reload();
	};

	return (
		<Center>
			<Wrapper>
				<Title>An unexpected error occured</Title>
				{errorMessage && (
					<Paragraph>
						Message: <Code>{String(errorMessage)}</Code>
					</Paragraph>
				)}

				<Paragraph>
					If the error persists, report the error at
					<br />
					<Anchor href={`${REPOSITORY_URL}/issues`} target="_blank" referrerPolicy="no-referrer">
						{REPOSITORY_URL}/issues
					</Anchor>
					<br /> or please contact the developer.
				</Paragraph>
				<Button onClick={handleClick}>Clear cache and reload</Button>
			</Wrapper>

			<Credits />
		</Center>
	);
};

export default ErrorPage;
