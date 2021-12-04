import { AppContext } from "App";
import { useEffect } from "react";
import { FC, useContext, useState } from "react";
import styled from "styled-components";
import KV from "./KV";

const Postition = styled.div`
	margin-top: 10px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
`;

const Wrapper = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 90%;
	max-width: 600px;
	background-color: ${({ theme }) => theme.colors.presance};
	border-radius: 10px;
	overflow: hidden;
	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
`;

const Avatar = styled.img`
	width: 120px;
	height: 120px;
	border-radius: 50%;
	margin-bottom: 10px;
	z-index: 2;
	pointer-events: none;
	user-select: none;
	padding: 3px;
	background-color: ${({ theme }) => theme.colors.background};
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
		<Postition>
			<Wrapper>
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
			</Wrapper>
			<KV data={state.presance.kv} />
		</Postition>
	);
};

export default User;
