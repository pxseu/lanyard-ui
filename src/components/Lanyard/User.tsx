import { AppContext } from "App";
import { Wrapper } from "components/Common";
import { useEffect } from "react";
import { FC, useContext, useState } from "react";
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

const Avatar = styled.img`
	width: 100%;
	height: 100%;
	border-radius: 50%;
	z-index: 2;
	pointer-events: none;
	user-select: none;
	padding: 5px;
	background-color: ${({ theme }) => theme.colors.presance};
	object-fit: cover;
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
	bottom: 10px;
	right: 16px;
	width: 25px;
	height: 25px;
	border-radius: 50%;
	background-color: ${({ color }) => color};
	border: 5px solid ${({ theme }) => theme.colors.presance};
`;

const User: FC = () => {
	const state = useContext(AppContext);
	const [bannerFailed, setBannerFailed] = useState(false);

	useEffect(() => {
		if (!state.presance) return;

		setBannerFailed(false);
	}, [state.presance?.discord_user.id]);

	if (!state.presance) return null;

	return (
		<UserWrapper>
			<Info>
				<Banner
					show={!bannerFailed}
					src={`https://dcdn.dstn.to/banners/${state.presance.discord_user.id}?size=2048`}
					onError={() => setBannerFailed(true)}
				/>
				<AvatarWrapper title={state.presance.discord_status}>
					<Avatar src={resolveAvatar(state.presance.discord_user)} />
					<Status color={colorFromStatus(state.presance.discord_status)} />
				</AvatarWrapper>
				<Username>
					{state.presance.discord_user.username}
					<Discriminator>#{state.presance.discord_user.discriminator}</Discriminator>
				</Username>
				<Id>{state.presance.discord_user.id}</Id>
			</Info>
		</UserWrapper>
	);
};

export default User;
