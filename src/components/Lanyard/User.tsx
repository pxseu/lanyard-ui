import { Wrapper } from "components/Common";
import { useFetchCached } from "hooks/fetchCached";
import { useAppContext } from "hooks/useContexts";
import { FC } from "react";
import styled from "styled-components";
import { ADD_MEDIA_URL } from "utils/consts";
import { colorFromStatus } from "utils/status";
import { resolveAvatar } from "../../utils/avatar";

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
`;

const Username = styled.p`
	max-width: 100%;
	display: inline-block;
	font-size: 2em;
	margin-bottom: 5px;
	background-color: ${({ theme }) => theme.colors.presance}50;
	padding: 2px 5px;
	border-radius: 5px;
	flex-shrink: 1;
	word-wrap: break-word;
	text-align: center;
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
	z-index: 2;
`;

const User: FC = () => {
	const state = useAppContext();
	const avatar = useFetchCached(resolveAvatar(state?.presance?.discord_user));
	const banner = useFetchCached(`${ADD_MEDIA_URL}/banners/${state.presance?.discord_user.id}?size=512`);

	if (!state.presance) return null;

	return (
		<UserWrapper>
			<Banner show={!!banner} src={banner} alt="User banner" />
			<AvatarWrapper title={state.presance.discord_status} isBanner={!!banner}>
				<Avatar show={!!avatar} src={avatar} alt="User avatar" />
				<Status color={state.presance.discord_status} />
			</AvatarWrapper>
			<TextWrapper>
				<Username
					title={`${state.presance.discord_user.username}#${state.presance.discord_user.discriminator}`}
				>
					{state.presance.discord_user.username}
					<Discriminator>#{state.presance.discord_user.discriminator}</Discriminator>
				</Username>
			</TextWrapper>
			{/* <TextWrapper>
				<Id title={state.presance.discord_user.id}>{state.presance.discord_user.id}</Id>
			</TextWrapper> */}
		</UserWrapper>
	);
};

export default User;
