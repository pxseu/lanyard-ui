import Loader from "components/Loader";
import { useLanyard } from "hooks/useLanyard";
import Inputs from "components/Data";
import { createContext, useEffect } from "react";
import User from "components/Lanyard/User";
import styled from "styled-components";
import Activity from "components/Lanyard/Activity";
import KV from "components/Lanyard/KV";
import { logger } from "utils/log";
import { PRODUCTION } from "utils/consts";

export const AppContext = createContext<ReturnType<typeof useLanyard>>({
	presance: null,
	connecting: true,
	subscribe: async () => {},
	setToken: () => {},
	request: async () => {},
});

const Postition = styled.div`
	margin-top: 10px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
`;

const log = logger("App");

const App = () => {
	const lanyard = useLanyard();

	useEffect(() => {
		log("NODE_ENV", process.env.NODE_ENV);
		log("PRODUCTION", PRODUCTION);
	}, []);

	if (lanyard.connecting) return <Loader />;

	return (
		<AppContext.Provider value={lanyard}>
			<Postition>
				<Inputs />
				<User />
				<Activity />
				<KV />
			</Postition>
		</AppContext.Provider>
	);
};

export default App;
