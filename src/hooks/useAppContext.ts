import { AppContext } from "App";
import { useContext } from "react";

export const useAppContext = () => {
	const context = useContext(AppContext);

	if (!context) throw new Error("No provider found for AppContext");

	return context;
};
