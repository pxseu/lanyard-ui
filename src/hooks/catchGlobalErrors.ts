import { useEffect, useState } from "react";
import { logger } from "@/utils/log";

const log = logger("info", "global_error_handler");
const normalizeError = (reason: unknown) =>
	reason instanceof Error ? reason : new Error(typeof reason === "string" ? reason : "Unexpected error");

export const useCatchGlobalErrors = () => {
	const [state, setState] = useState<Error | null>(null);

	useEffect(() => {
		const handleError = (error: ErrorEvent | PromiseRejectionEvent) => {
			const nextError =
				error instanceof ErrorEvent
					? normalizeError(error.error ?? error.message)
					: normalizeError(error.reason);

			log(nextError);
			setState(nextError);
		};

		window.addEventListener("error", handleError);
		window.addEventListener("unhandledrejection", handleError);

		log("Added error listener");

		return () => {
			window.removeEventListener("error", handleError);
			window.removeEventListener("unhandledrejection", handleError);
		};
	}, []);

	return state;
};
