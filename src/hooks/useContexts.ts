import { useContext } from "react";
import { AppContext } from "@/App";

export const useAppContext = () => {
	const context = useContext(AppContext);

	if (!context) throw new Error("No provider found for AppContext");

	return context;
};
