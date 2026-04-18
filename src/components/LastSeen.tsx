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
	const presence = state.presence;

	const time = useTime({
		start: presence?.last_seen,
	});

	// not implemented yet
	if (presence?.discord_status !== "offline" || !presence.last_seen) return null;

	return (
		<Wrapper>
			<Paragraph>
				User was last seen online: <Code>{time?.start}</Code> ago.
			</Paragraph>
		</Wrapper>
	);
};

export default LastSeen;
