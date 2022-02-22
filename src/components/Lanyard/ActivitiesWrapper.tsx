import React, { FC } from "react";
import { useAppContext } from "hooks/useContexts";
import { Wrapper } from "components/Common";
import Activity from "./Activity";
import { Activity as ActivityType } from "lanyard";
import styled from "styled-components";

const DEFAULT_ACTIVITY = {
	type: 0,
	id: "",
	state: "",
	assets: {},
	timestamps: {},
	application_id: "",
	name: "Not doing anythin",
	details: "",
	created_at: Date.now(),
};

const ActivityWrapper = styled(Wrapper)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-flow: column nowrap;
	flex-direction: row;
	overflow-x: auto;
	overscroll-behavior-inline: contain;
	scroll-snap-type: x mandatory;

	& > div {
		display: flex;
		flex: none;
		scroll-snap-align: center;
		width: 100%;
	}
`;

const Activities: FC = () => {
	const { presance } = useAppContext();

	if (!presance) return null;

	const activities: ActivityType[] = presance.activities.length > 0 ? presance.activities : [DEFAULT_ACTIVITY];

	return (
		<ActivityWrapper>
			{activities.map((activity) => (
				<Activity key={activity.id} activity={activity} focused={true} />
			))}
		</ActivityWrapper>
	);
};

export default Activities;
