import type { DiscordUser } from "lanyard";
import type { FC } from "react";
import styled from "styled-components";
import { resolveBadges } from "@/utils/badges";

const BadgesWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 5px;
	justify-content: center;
	margin-top: 0.25rem;
	margin-bottom: 0.25rem;
`;

const Badge = styled.img`
	width: 24px;
	height: 24px;
	transition: transform 0.2s ease-in-out;

	&:hover {
		transform: scale(1.2);
	}
`;

interface BadgesProps {
	user: DiscordUser;
}

const Badges: FC<BadgesProps> = ({ user }) => {
	const badges = resolveBadges(user);

	if (badges.length === 0) return null;

	return (
		<BadgesWrapper>
			{badges.map((badge) => (
				<Badge key={badge.id} src={badge.url} alt={badge.id} title={badge.id} />
			))}
		</BadgesWrapper>
	);
};

export default Badges;
