import { Anchor, Wrapper } from "components/Common";
import { useFetchCached } from "hooks/fetchCached";
import { useTime } from "hooks/useTime";
import { Activity as ActivityType } from "lanyard";
import React, { FC, memo } from "react";
import styled from "styled-components";
import { stringFromType } from "utils/activity";
import { resolveActivity } from "utils/asset";
import Progress from "./Progress";

const ActivityWrapper = styled(Wrapper)`
	margin: 0;
	margin-top: 2px;
	margin-bottom: 2px;
	box-shadow: none;
	flex-direction: row;
	overflow: hidden;
	flex-wrap: wrap;

	--border-width: 2px;
	border-radius: 0;
	box-shadow: var(--border-width) 0px 0px 0px ${({ theme }) => theme.colors.outline},
		calc(-1 * var(--border-width)) 0px 0px 0px ${({ theme }) => theme.colors.outline};

	--gap: 20px;
	margin-left: var(--gap);
	margin-right: var(--gap);

	&:only-child {
		--gap: 0;
	}

	@media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
		flex-direction: column;
	}

	&:focus {
		box-shadow: none;
	}
`;

const Collumn = styled.div<{ flex?: boolean }>`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	height: 100%;
	${({ flex }) => flex && "flex: 1; width: 100%; overflow: hidden; margin-right: 10px;"}

	@media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
		${({ flex }) => flex && "padding: 10px; margin-right: 0;"}
	}
`;

const AssetWrapper = styled.div`
	position: relative;
	width: 110px;
	height: 110px;
	margin: 5px;
	margin-right: 15px;

	@media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
		margin: 5px;
	}
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

const ActivityName = styled.p<{ inline?: boolean }>`
	display: inline-block;
	position: relative;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 1.25em;
	font-weight: bold;
	overflow: hidden;
	width: 100%;
	${({ inline }) => inline && "display: inline; width: unset;"}
`;

const ActivityDetails = styled(ActivityName)`
	font-weight: normal;
	font-size: 1.1em;
	margin: 0;
`;

interface ActivityProps {
	activity: ActivityType;
	focused: boolean;
}

const Activity: FC<ActivityProps> = ({ activity, focused }) => {
	const isEmoji = activity.type === 4 && !!activity.emoji;
	const asset = useFetchCached(resolveActivity(activity, "large"));
	const assetSmaller = useFetchCached(resolveActivity(activity, "small"));
	const time = useTime(activity.timestamps);

	return (
		<ActivityWrapper tabIndex={focused ? 0 : undefined}>
			<Collumn>
				<AssetWrapper title={activity.type === 4 && !!activity.emoji ? activity.emoji.name : activity.name}>
					<Asset emoji={isEmoji} show={!!asset} src={asset} alt="Activity asset" />

					{activity.assets?.small_image && (
						<AssetSmaller show={!!assetSmaller} src={assetSmaller} alt="Smaller activity asset" />
					)}
				</AssetWrapper>
			</Collumn>
			<Collumn flex>
				<ActivityName>
					{stringFromType(activity.type)} {activity.name}
				</ActivityName>
				{activity.details &&
					(activity.type === 2 && activity.sync_id ? (
						<Anchor
							href={`https://open.spotify.com/track/${activity.sync_id}`}
							target="_blank"
							referrerPolicy="no-referrer"
							tabIndex={focused ? 0 : -1}
						>
							<ActivityDetails
								title={activity.details}
								inline={activity.type === 2 && !!activity.sync_id}
							>
								{activity.details}
							</ActivityDetails>
						</Anchor>
					) : (
						<ActivityDetails title={activity.details}>{activity.details}</ActivityDetails>
					))}

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
				{time && time.start && !time.end && (
					<ActivityDetails title={time.start}>{time.start} elapsed</ActivityDetails>
				)}
				{time && time.end && !time.start && <ActivityDetails title={time.end}>{time.end} left</ActivityDetails>}
			</Collumn>

			<Progress time={time} activity={activity.type} />
		</ActivityWrapper>
	);
};

export default memo(Activity);
