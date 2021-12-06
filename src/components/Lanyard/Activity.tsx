import { AppContext } from "App";
import { Wrapper } from "components/Common";
import { FC, useContext } from "react";
import styled from "styled-components";
import { stringFromType } from "utils/activity";
import { resolveAsset } from "utils/asset";
import { resolveEmoji } from "utils/emoji";
import { logger } from "utils/log";

const log = (...args: any[]) => logger("Activity", ...args);

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
	width: 100px;
	height: 100px;
	margin: 5px;
	margin-right: 15px;
`;

const Asset = styled.img<{ emoji?: boolean }>`
	position: absolute;
	top: ${({ emoji }) => (emoji ? "5%" : 0)};
	left: ${({ emoji }) => (emoji ? "5%" : 0)};
	width: ${({ emoji }) => (emoji ? "90%" : "100%")};
	height: ${({ emoji }) => (emoji ? "90%" : "100%")};
	${({ emoji }) => !emoji && "border-radius: 10px;"}
	${({ emoji }) => emoji && "object-fit: contain;"}
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

	const ordered = state.presance?.activities.sort((a, b) => a.type - b.type);

	log(ordered);

	const activity = ordered[0] ?? {
		name: "Not doing anything",
	};

	// if (!activity) return null;

	const isEmoji = activity.type === 4 && !!activity.emoji;

	return (
		<ActivityWrapper>
			<Collumn>
				<AssetWrapper title={activity.type === 4 && !!activity.emoji ? activity.emoji.name : activity.name}>
					<Asset
						emoji={isEmoji}
						src={
							activity.type === 4 && !!activity.emoji
								? resolveEmoji(activity.emoji)
								: resolveAsset(activity?.assets?.large_image, activity?.application_id)
						}
					/>

					{activity.assets?.small_image && (
						<AssetSmaller src={resolveAsset(activity.assets.small_image, activity.application_id)} />
					)}
				</AssetWrapper>
			</Collumn>
			<Collumn flex>
				<ActivityName>
					{stringFromType(activity.type)} {activity.name}
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
