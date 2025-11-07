import Loader from "@/components/Loader";
import { useLanyard } from "@/hooks/useLanyard";
import Inputs from "@/components/Data";
import { createContext, FC, useEffect } from "react";
import User from "@/components/Lanyard/User";
import styled from "styled-components";
import KV from "@/components/Lanyard/KV";
import { logger } from "@/utils/log";
import { PRODUCTION } from "@/utils/consts";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Credits from "@/components/Credits";
import Activities from "@/components/Lanyard/ActivitiesWrapper";
import LastSeen from "@/components/LastSeen";

export const AppContext = createContext<ReturnType<typeof useLanyard> | null>(
	null,
);

const Postition = styled.div`
	padding-top: 30px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
`;

const log = logger("info", "App");

const App: FC = () => {
	const lanyard = useLanyard();

	useEffect(() => {
		log("MODE", import.meta.env.MODE);
		log("PRODUCTION", PRODUCTION);
	}, []);

	if (lanyard.connecting || !lanyard.presance) return <Loader />;

	return (
		<HelmetProvider>
			<AppContext.Provider value={lanyard}>
				<Helmet>
					{lanyard.presance ? (
						<title>
							{`Checking User: ${lanyard.presance.discord_user.username}${
								lanyard.presance.discord_user.discriminator !== "0"
									? `#${lanyard.presance.discord_user.discriminator}`
									: ""
							}`}
						</title>
					) : (
						<title>Lanyard UI</title>
					)}
				</Helmet>
				<Postition>
					<Inputs />
					<User />
					<LastSeen />
					<Activities />
					<KV />
					<Credits />
				</Postition>
			</AppContext.Provider>
		</HelmetProvider>
	);
};

export default App;
