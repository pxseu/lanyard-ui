import { AppContext } from "App";
import { Anchor, Wrapper } from "components/Common";
import { FC, useContext } from "react";
import styled from "styled-components";
import { stringFromType } from "utils/activity";
import { resolveAsset } from "utils/asset";
import { resolveEmoji } from "utils/emoji";
import { logger } from "utils/log";

const log = logger("Activity");

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
	font-size: 1.25em;
	font-weight: bold;
`;

const ActivityDetails = styled(ActivityName)`
	font-weight: normal;
	font-size: 1.1em;
	margin: 0;
`;

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
				{activity.details && (
					<ActivityDetails title={activity.details}>
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
				)}

				{activity.state && (
					<ActivityDetails title={activity.type === 2 ? activity.state.split(";").join() : activity.state}>
						{activity.type === 2 ? `by: ${activity.state.split(";").join()}` : activity.state}
					</ActivityDetails>
				)}
				{activity.type === 2 && activity.assets.large_text && (
					<ActivityDetails title={`${activity.assets.large_text}`}>
						on: {activity.assets.large_text}
					</ActivityDetails>
				)}
			</Collumn>
		</ActivityWrapper>
	);
};

export default Activity;
