import { createContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import styled from "styled-components";
import Credits from "@/components/Credits";
import Inputs from "@/components/Data";
import Activities from "@/components/Lanyard/ActivitiesWrapper";
import KV from "@/components/Lanyard/KV";
import User from "@/components/Lanyard/User";
import LastSeen from "@/components/LastSeen";
import Loader from "@/components/Loader";
import { useLanyard } from "@/hooks/useLanyard";
import { PRODUCTION } from "@/utils/consts";
import { logger } from "@/utils/log";

export const AppContext = createContext<ReturnType<typeof useLanyard> | null>(null);

const Position = styled.div`
	padding-top: 30px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
`;

const log = logger("info", "App");

const App = () => {
	const lanyard = useLanyard();
	const presence = lanyard.presence;

	useEffect(() => {
		log("MODE", import.meta.env.MODE);
		log("PRODUCTION", PRODUCTION);
	}, []);

	if (lanyard.connecting || !presence) return <Loader />;

	return (
		<AppContext.Provider value={lanyard}>
			<Helmet>
				<title>
					{`Checking User: ${presence.discord_user.username}${
						presence.discord_user.discriminator !== "0" ? `#${presence.discord_user.discriminator}` : ""
					}`}
				</title>
			</Helmet>
			<Position>
				<Inputs />
				<User />
				<LastSeen />
				<Activities />
				<KV />
				<Credits />
			</Position>
		</AppContext.Provider>
	);
};

export default App;
