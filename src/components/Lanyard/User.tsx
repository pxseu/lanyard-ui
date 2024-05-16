import { Wrapper } from "components/Common";
import { useFetchCached } from "hooks/fetchCached";
import { useAppContext } from "hooks/useContexts";
import { FC } from "react";
import styled from "styled-components";
import { ADD_MEDIA_URL } from "utils/consts";
import { colorFromStatus } from "utils/status";
import { resolveAvatar, resolveDecoration } from "../../utils/avatar";
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

const AvatarWrapper = styled.div<{ isBanner: boolean }>`
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
	${({ show }) => !show && "display: none;"};
	pointer-events: none;
	user-select: none;
`;

const Avatar = styled(Banner)`
	height: 100%;
	border-radius: 50%;
	z-index: 2;
	padding: 5px;
	background-color: ${({ theme }) => theme.colors.presance};
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
	background-color: ${({ theme }) => theme.colors.presance}50;
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
	border: 5px solid ${({ theme }) => theme.colors.presance};
	z-index: 4;
`;

const DecorationImage = styled.img`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 105%;
	height: 105%;
	z-index: 3;

	::before {
		content: "";
	}
`;

const User: FC = () => {
	const state = useAppContext();
	const avatar = useFetchCached(resolveAvatar(state?.presance?.discord_user));
	const banner = useFetchCached(`${ADD_MEDIA_URL}/banners/${state.presance?.discord_user.id}?size=512`);
	const decorationHover = useFetchCached(resolveDecoration(true, state?.presance?.discord_user));
	const decoration = useFetchCached(resolveDecoration(false, state?.presance?.discord_user));

	if (!state.presance) return null;

	return (
		<UserWrapper>
			<Banner show={!!banner} src={banner} alt="User banner" />
			<AvatarWrapper title={state.presance.discord_status} isBanner={!!banner}>
				<Avatar show={!!avatar} src={avatar} alt="User avatar" />
				<Status color={state.presance.discord_status} />
				{/* state issue resolved 💯💯💯💯 */}
				{state.presance.discord_user.avatar_decoration_data && decoration && decorationHover && (
					<DecorationImage
						src={decoration}
						alt="User decoration"
						// hacky but works :)
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
				{state.presance.discord_user.discriminator !== "0" ? (
					<Username>
						{state.presance.discord_user.username}
						<Discriminator>#{state.presance.discord_user.discriminator}</Discriminator>
					</Username>
				) : (
					<>
						{/* it indeed is the other way around but i dont care to hcange the names of jsx elements */}
						<Username>{state.presance.discord_user.global_name}</Username>
						<GlobalName>{state.presance.discord_user.username}</GlobalName>
					</>
				)}

				<Clan clan={state.presance.discord_user.clan} />
			</TextWrapper>
			{/* <TextWrapper>
				<Id title={state.presance.discord_user.id}>{state.presance.discord_user.id}</Id>
			</TextWrapper> */}
		</UserWrapper>
	);
};

export default User;
