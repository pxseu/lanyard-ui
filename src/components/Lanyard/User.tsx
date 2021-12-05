import { AppContext } from "App";
import { Wrapper } from "components/Common";
import { useEffect } from "react";
import { FC, useContext, useState } from "react";
import styled from "styled-components";

const UserWrapper = styled(Wrapper)`
	border-radius: 10px;
	overflow: hidden;
	justify-content: center;
`;

const Avatar = styled.img`
	width: 120px;
	height: 120px;
	border-radius: 50%;
	margin-bottom: 10px;
	z-index: 2;
	pointer-events: none;
	user-select: none;
	padding: 5px;
	background-color: ${({ theme }) => theme.colors.presance};
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
`;

const Discriminator = styled.span`
	color: ${({ theme }) => theme.colors.primary}aa;
`;

const Id = styled(Username)`
	font-size: 1em;
	color: ${({ theme }) => theme.colors.primary}aa;
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
					src={`https://dcdn.dstn.to/banners/${state.presance.discord_user.id}?size=4096`}
					onError={() => setBannerFailed(true)}
				/>
				<Avatar
					src={`https://cdn.discordapp.com/avatars/${state.presance.discord_user.id}/${state.presance.discord_user.avatar}.webp`}
				/>
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
