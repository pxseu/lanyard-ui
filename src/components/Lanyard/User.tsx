import { Wrapper } from "components/Common";
import { useFetchCached } from "hooks/fetchCached";
import { useAppContext } from "hooks/useAppContext";
import { FC } from "react";
import styled from "styled-components";
import { colorFromStatus } from "utils/status";
import { resolveAvatar } from "../../utils/avatar";

const UserWrapper = styled(Wrapper)`
	border-radius: 10px;
	overflow: hidden;
	justify-content: center;
`;

const AvatarWrapper = styled.div`
	position: relative;
	width: 160px;
	height: 160px;
	margin-bottom: 10px;
`;

const Banner = styled.img<{ show: boolean }>`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	${({ show }) => !show && "display: none;"};
	pointer-events: none;
	user-select: none;
`;

const Avatar = styled(Banner)`
	border-radius: 50%;
	z-index: 2;
	padding: 5px;
	background-color: ${({ theme }) => theme.colors.presance};
`;

const Info = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 10px;
`;

const Username = styled.div`
	font-size: 2em;
	margin-bottom: 5px;
	z-index: 2;
	background-color: ${({ theme }) => theme.colors.presance}50;
	padding: 2px 5px;
	border-radius: 5px;
`;

const Discriminator = styled.span`
	color: ${({ theme }) => theme.colors.primary}aa;
`;

const Id = styled(Username)`
	font-size: 1em;
	color: ${({ theme }) => theme.colors.primary}aa;
`;

const Status = styled.div<{ color: string }>`
	position: absolute;
	bottom: 9px;
	right: 16px;
	width: 27px;
	height: 27px;
	border-radius: 50%;
	background-color: ${({ color }) => color};
	border: 5px solid ${({ theme }) => theme.colors.presance};
	z-index: 2;
`;

const User: FC = () => {
	const state = useAppContext();
	const avatar = useFetchCached(resolveAvatar(state?.presance?.discord_user));
	const banner = useFetchCached(`https://dcdn.dstn.to/banners/${state.presance?.discord_user.id}?size=2048`);

	if (!state.presance) return null;

	return (
		<UserWrapper>
			<Info>
				<Banner show={!!banner} src={banner} />
				<AvatarWrapper title={state.presance.discord_status}>
					<Avatar show={!!avatar} src={avatar} />
					<Status color={colorFromStatus(state.presance.discord_status)} />
				</AvatarWrapper>
				<Username
					title={`${state.presance.discord_user.username}#${state.presance.discord_user.discriminator}`}
				>
					{state.presance.discord_user.username}
					<Discriminator>#{state.presance.discord_user.discriminator}</Discriminator>
				</Username>
				<Id>{state.presance.discord_user.id}</Id>
			</Info>
		</UserWrapper>
	);
};

export default User;
