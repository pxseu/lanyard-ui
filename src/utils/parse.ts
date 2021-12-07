import pako from "pako";
import { logger } from "./log";

const log = logger("pako");

export const parse = <T>(data: ArrayBuffer): T => {
	if (typeof data === "string") return JSON.parse(data);

	// log("parsing data", data);

	const decompressed = pako.inflate(new Uint8Array(data), { to: "string" });

	log("decompressed", decompressed);

	return JSON.parse(decompressed);
};

export const stringify = (data: any) => {
	return JSON.stringify(data);

	// code bellow is not used because compression is only recieved from server
	// if (!PRODUCTION) return JSON.stringify(data);
	// // log("stringifying data", data);
	// const compressed = pako.deflate(JSON.stringify(data));
	// log("compressed", compressed);
	// return compressed;
};
