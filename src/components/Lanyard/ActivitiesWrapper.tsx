import type { Activity as ActivityType } from "lanyard";
import styled from "styled-components";
import { Wrapper } from "@/components/Common";
import { useAppContext } from "@/hooks/useContexts";
import Activity from "./Activity";

const DEFAULT_ACTIVITY = {
	type: 0,
	id: "",
	state: "",
	assets: {},
	timestamps: {},
	application_id: "",
	name: "Not doing anything",
	details: "",
	created_at: Date.now(),
} satisfies ActivityType;

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

const Activities = () => {
	const { presence } = useAppContext();

	if (!presence) return null;

	const activities: ActivityType[] = presence.activities.length > 0 ? presence.activities : [DEFAULT_ACTIVITY];

	return (
		<ActivityWrapper>
			{activities.map((activity) => (
				<Activity key={activity.id} activity={activity} focused={true} />
			))}
		</ActivityWrapper>
	);
};

export default Activities;
