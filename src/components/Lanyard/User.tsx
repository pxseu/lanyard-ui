import { motion } from "framer-motion";
import styled from "styled-components";
import { Wrapper } from "@/components/Common";
import { useFetchCached } from "@/hooks/fetchCached";
import { useAppContext } from "@/hooks/useContexts";
import { resolveAvatar, resolveDecoration } from "@/utils/avatar";
import { ADD_MEDIA_URL } from "@/utils/consts";
import { colorFromStatus } from "@/utils/status";
import Badges from "./Badges";
import Clan from "./Clan";

const UserWrapper = styled(Wrapper)`
	border-radius: 10px;
	overflow: hidden;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	padding: 10px;
`;

const AvatarWrapper = styled(motion.div)<{ isBanner: boolean }>`
	position: relative;
	width: 210px;
	height: 210px;
	${({ isBanner }) => (isBanner ? "margin-top: 80px;" : "margin-top: 10px;")}
`;

const Banner = styled.img<{ show: boolean }>`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 55%;
	object-fit: cover;
	pointer-events: none;
	user-select: none;
	${({ show }) => !show && "display: none;"}
`;

const Avatar = styled(Banner)`
	height: 100%;
	border-radius: 50%;
	z-index: 2;
	padding: 5px;
	background-color: ${({ theme }) => theme.colors.surface};
`;

const TextWrapper = styled.div`
	margin-top: 10px;
	width: 90%;
	z-index: 2;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	margin-bottom: 5px;
`;

const Username = styled.p`
	max-width: 100%;
	display: inline-block;
	font-size: 2em;
	background-color: ${({ theme }) => theme.colors.surface}50;
	flex-shrink: 1;
	word-wrap: break-word;
	text-align: center;
`;

const GlobalName = styled(Username)`
	display: block;
	font-size: 1.2em;
`;

const Discriminator = styled.span`
	color: ${({ theme }) => theme.colors.primary}aa;
`;

// const Id = styled(Username)`
// 	font-size: 1em;
// 	color: ${({ theme }) => theme.colors.primary}aa;
// `;

const Status = styled.div<{ color: string }>`
	position: absolute;
	bottom: 12px;
	right: 22px;
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background-color: ${({ color }) => colorFromStatus(color)};
	border: 5px solid ${({ theme }) => theme.colors.surface};
	z-index: 4;
`;

const DecorationImage = styled.img`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 115%;
	height: 115%;
	z-index: 3;

	::before {
		content: "";
	}
`;

const User = () => {
	const state = useAppContext();
	const { presence } = state;
	const avatar = useFetchCached(
		presence ? resolveAvatar(presence.discord_user) : null,
	);
	const banner = useFetchCached(
		presence
			? `${ADD_MEDIA_URL}/banners/${presence.discord_user.id}?size=512`
			: null,
	);
	const decorationHover = useFetchCached(
		presence ? resolveDecoration(true, presence.discord_user) : null,
	);
	const decoration = useFetchCached(
		presence ? resolveDecoration(false, presence.discord_user) : null,
	);

	if (!presence) return null;

	return (
		<UserWrapper>
			<Banner show={!!banner} src={banner} alt="User banner" />
			<AvatarWrapper title={presence.discord_status} isBanner={!!banner}>
				<Avatar show={!!avatar} src={avatar} alt="User avatar" />
				<Status color={presence.discord_status} />
				{presence.discord_user.avatar_decoration_data &&
					decoration &&
					decorationHover && (
						<DecorationImage
							src={decoration}
							alt="User decoration"
							onMouseEnter={(e) => {
								e.currentTarget.src = decorationHover;
							}}
							onMouseLeave={(e) => {
								e.currentTarget.src = decoration;
							}}
						/>
					)}
			</AvatarWrapper>
			<TextWrapper>
				{presence.discord_user.discriminator !== "0" ? (
					<Username>
						{presence.discord_user.username}
						<Discriminator>
							#{presence.discord_user.discriminator}
						</Discriminator>
					</Username>
				) : (
					<>
						<Username>{presence.discord_user.global_name}</Username>
						<GlobalName>{presence.discord_user.username}</GlobalName>
					</>
				)}
				<Badges user={presence.discord_user} />
				{presence.discord_user.primary_guild ? (
					<Clan clan={presence.discord_user.primary_guild} />
				) : null}
			</TextWrapper>
		</UserWrapper>
	);
};

export default User;
