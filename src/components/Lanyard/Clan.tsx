import type { DiscordUser } from "lanyard";
import type { FC } from "react";
import styled from "styled-components";
import { useFetchCached } from "@/hooks/fetchCached";

// https://cdn.discordapp.com/clan-badges/${clan.identity_guild_id}/${clan.badge}.png

const Wrapper = styled.div`
	margin-top: 0.25rem;

	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: row;

	background-color: hsla(0, 0%, 28%, 0.85);
	padding: 0.1rem 0.5rem;
	border-radius: 0.5rem;
	transition: background-color 0.2s ease-in-out;

	&:hover {
		background-color: hsla(0, 0%, 50%, 0.85);
	}
`;

const Badge = styled.img<{ show: boolean }>`
	width: 1.2rem;
	height: 1.2rem;
	object-fit: cover;
	pointer-events: none;
	user-select: none;
	margin-right: 0.25rem;
	${({ show }) => !show && "display: hidden;"};
`;

const ClanName = styled.p`
	font-size: 1.2rem;
	font-weight: 600;
`;

const Clan: FC<{ clan: NonNullable<DiscordUser["clan"]> }> = ({ clan }) => {
	const image = useFetchCached(
		`https://cdn.discordapp.com/clan-badges/${clan.identity_guild_id}/${clan.badge}.png`,
	);

	return (
		<Wrapper>
			<Badge show={!!image} src={image} />
			<ClanName>{clan.tag}</ClanName>
		</Wrapper>
	);
};

export default Clan;
