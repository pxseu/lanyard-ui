import { useEffect, useState } from "react";
import { logger } from "utils/log";

const log = logger("info", "global_error_handler");

export const useCatchGlobalErrors = () => {
	const [state, setState] = useState<Error | null>(null);

	useEffect(() => {
		const handleError = (error: ErrorEvent | PromiseRejectionEvent) => {
			log(error);

			if (error instanceof ErrorEvent) {
				setState(error.error);
			} else {
				setState(error.reason);
			}
		};

		window.addEventListener("error", handleError);
		window.addEventListener("unhandledrejection", handleError);

		log("Added error listener");

		return () => {
			window.removeEventListener("error", handleError);
		};
	}, []);

	return state;
};
