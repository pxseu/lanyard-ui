import Loader from "components/Loader";
import { useLanyard } from "hooks/useLanyard";
import Inputs from "components/Data";
import { createContext } from "react";
import User from "components/Lanyard/User";

export const AppContext = createContext<ReturnType<typeof useLanyard>>({
	presance: null,
	connecting: true,
	subscribe: async () => {},
	setToken: () => {},
	request: async () => {},
});

const App = () => {
	const lanyard = useLanyard();

	if (lanyard.connecting) return <Loader />;

	return (
		<AppContext.Provider value={lanyard}>
			<Inputs />
			<User />
		</AppContext.Provider>
	);
};

export default App;
