import * as pako from "pako";
import { PRODUCTION } from "./consts";
import { logger } from "./log";

const log = logger("log", "parse", true);

export const parse = <T>(data: ArrayBuffer | string): T => {
	const decompressed =
		typeof data === "string"
			? data
			: pako.inflate(new Uint8Array(data), { to: "string" });

	return JSON.parse(decompressed, (key, value) => {
		if (!PRODUCTION) log(key, value, typeof value);

		if (typeof value !== "number" || Number.MAX_SAFE_INTEGER > value) {
			return value;
		}

		const maxLen = Number.MAX_SAFE_INTEGER.toString().length - 1;
		const needle = String(value).slice(0, maxLen);

		const re = new RegExp(`${needle}\\d+`);
		const matches = decompressed.match(re);

		if (matches) {
			return String(matches[0]);
		}

		return value;
	});
};

export const stringify = <T>(data: T) => {
	return JSON.stringify(data);

	// if (!PRODUCTION) return JSON.stringify(data);
	// // log("stringifying data", data);
	// const compressed = pako.deflate(JSON.stringify(data));
	// log("compressed", compressed);
	// return compressed;
};
