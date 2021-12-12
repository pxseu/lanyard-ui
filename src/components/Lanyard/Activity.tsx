import { Anchor, Wrapper } from "components/Common";
import { useFetchCached } from "hooks/fetchCached";
import { useAppContext } from "hooks/useAppContext";
import { useTime } from "hooks/useTime";
import { Activity as ActivityType } from "lanyard";
import { FC } from "react";
import styled from "styled-components";
import { stringFromType } from "utils/activity";
import { resolveActivity } from "utils/asset";

const ActivityWrapper = styled(Wrapper)`
	flex-direction: row;
	overflow: hidden;
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

const Asset = styled.img<{ emoji?: boolean; show: boolean }>`
	position: absolute;
	top: ${({ emoji }) => (emoji ? "5%" : 0)};
	left: ${({ emoji }) => (emoji ? "5%" : 0)};
	width: ${({ emoji }) => (emoji ? "90%" : "100%")};
	height: ${({ emoji }) => (emoji ? "90%" : "100%")};
	${({ emoji }) => !emoji && "border-radius: 10px;"}
	${({ emoji }) => emoji && "object-fit: contain;"}
	pointer-events: none;
	user-select: none;
	${({ show }) => !show && "display: none;"}
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

const ProgressBar = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;
	width: calc(var(--progress) * 1%);
	height: 5px;
	background-color: ${({ theme }) => theme.colors.primary};
	border-radius: 5px;
`;

const Activity: FC = () => {
	const state = useAppContext();

	const ordered = state.presance?.activities.sort((a, b) => a.type - b.type);
	const activity =
		ordered?.[0] ??
		({
			name: "Not doing anything",
		} as ActivityType);
	const isEmoji = activity.type === 4 && !!activity.emoji;

	const asset = useFetchCached(resolveActivity(activity, "large"));
	const assetSmaller = useFetchCached(resolveActivity(activity, "small"));
	const time = useTime(activity.timestamps);

	if (!state.presance) return null;

	return (
		<ActivityWrapper>
			<Collumn>
				<AssetWrapper title={activity.type === 4 && !!activity.emoji ? activity.emoji.name : activity.name}>
					<Asset emoji={isEmoji} show={!!asset} src={asset} />

					{activity.assets?.small_image && <AssetSmaller show={!!assetSmaller} src={assetSmaller} />}
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
				{time && !time.end && <ActivityDetails title={time.start}>{time.start}</ActivityDetails>}

				{/* {time && time.end && (
					<ActivityDetails title={time.end}>
						{time.start} - {time.end}
					</ActivityDetails>
				)} */}
			</Collumn>
			{/* @ts-expect-error stupid css */}
			{time?.completion && <ProgressBar style={{ "--progress": time.completion }} />}
		</ActivityWrapper>
	);
};

export default Activity;
