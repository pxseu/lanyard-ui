// a function to log messages to the console with a label and timestamp with a color

import { PRODUCTION } from "./consts";

export const logger = (level: "log" | "warn" | "error" | "info", label: string, debug = false) => {
	return (...args: any[]) => {
		if (debug && PRODUCTION) return;

		return console[level](
			`%c[${label.toUpperCase()}]`,
			"color: #a000f0; font-weight: bold; padding: 5px; background-color: #cccccc; border-radious: 5px;",
			...args,
		);
	};
};
