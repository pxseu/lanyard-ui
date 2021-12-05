import { AppContext } from "App";
import { Wrapper } from "components/Common";
import { FC, useContext } from "react";
import styled from "styled-components";
import { PLACEHOLDER } from "utils/consts";

const ActivityWrapper = styled(Wrapper)`
	flex-direction: row;
`;

const Collumn = styled.div<{ flex?: boolean }>`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	height: 100%;
	${({ flex }) => flex && "flex: 1; width: 100%; overflow: hidden; margin-right: 10px;"}
`;

const AssetWrapper = styled.div`
	position: relative;
	width: 120px;
	height: 120px;
	margin: 5px;
	margin-right: 15px;
`;

const Asset = styled.img`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border-radius: 10px;
	pointer-events: none;
	user-select: none;
`;

const AssetSmaller = styled(Asset)`
	top: unset;
	left: unset;
	bottom: -5px;
	right: -5px;
	width: 40px;
	height: 40px;
	background-color: ${({ theme }) => theme.colors.presance};
	padding: 3px;
	border-radius: 50%;
`;

const ActivityName = styled.p`
	position: relative;
	overflow: hidden;
	width: 100%;
	display: inline-block;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 1.5em;
	margin-bottom: 3px;
	font-weight: bold;
`;

const ActivityDetails = styled(ActivityName)`
	font-weight: normal;
	font-size: 1.2em;
	margin: 0;
`;

const Anchor = styled.a`
	color: ${({ theme }) => theme.colors.primary};
	text-decoration: underline;
	cursor: pointer;
`;

const resolveAsset = (asset?: string, applicationId?: string) => {
	const split = asset?.split(":");

	if (split?.length && split[0] === "spotify") return `https://i.scdn.co/image/${split[1]}`;

	if (!asset || !applicationId) return PLACEHOLDER;

	return `https://cdn.discordapp.com/app-assets/${applicationId}/${asset}.webp`;
};

const StringFromType = (type: number) => {
	switch (type) {
		case 0:
			return "Playing";
		case 1:
			return "Streaming";
		case 2:
			return "Listening to";
		case 3:
			return "Watching";
		default:
			return "";
	}
};

/*
    {activity?.name}
    {"\n"}
    {activity?.details}
    {"\n"}
    {activity?.state}
    {"\n"}
    {resolveAsset(activity!.assets.large_image, activity!.application_id)}
*/
const Activity: FC = () => {
	const state = useContext(AppContext);

	if (!state.presance) return null;

	const activity = state.presance?.activities[0];

	if (!activity) return null;

	console.log(state.presance);

	return (
		<ActivityWrapper>
			<Collumn>
				<AssetWrapper>
					<Asset
						src={resolveAsset(activity?.assets?.large_image, activity?.application_id)}
						onError={() => resolveAsset()}
					/>

					{activity.assets?.small_image && (
						<AssetSmaller
							src={resolveAsset(activity.assets.small_image, activity.application_id)}
							onError={() => resolveAsset()}
						/>
					)}
				</AssetWrapper>
			</Collumn>
			<Collumn flex>
				<ActivityName>
					{StringFromType(activity.type)} {activity.name}
				</ActivityName>
				<ActivityDetails>
					{activity.type === 2 && activity.sync_id ? (
						<Anchor
							href={`https://open.spotify.com/track/${activity.sync_id}`}
							target="_blank"
							referrerPolicy="no-referrer"
						>
							{activity.details}
						</Anchor>
					) : (
						activity.details
					)}
				</ActivityDetails>
				<ActivityDetails>
					{activity.type === 2 ? activity.state.split(";").join() : activity.state}
				</ActivityDetails>
			</Collumn>
		</ActivityWrapper>
	);
};

export default Activity;
