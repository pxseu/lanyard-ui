import styled from "styled-components";
import { Wrapper } from "@/components/Common";
import { useAppContext } from "@/hooks/useContexts";
import { useTime } from "@/hooks/useTime";

const Paragraph = styled.p`
	text-align: center;
`;

const Code = styled.code``;

const LastSeen = () => {
	const state = useAppContext();

	const time = useTime({
		start: state.presance?.last_seen,
	});

	// not implemented yet
	if (state.presance?.discord_status !== "offline" || !state.presance?.last_seen) return null;

	return (
		<Wrapper>
			<Paragraph>
				User was last seen online: <Code>{time?.start}</Code> ago.
			</Paragraph>
		</Wrapper>
	);
};

export default LastSeen;
