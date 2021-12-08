import pako from "pako";

export const parse = <T>(data: ArrayBuffer): T => {
	if (typeof data === "string") return JSON.parse(data);

	const decompressed = pako.inflate(new Uint8Array(data), { to: "string" });

	return JSON.parse(decompressed);
};

export const stringify = (data: any) => {
	return JSON.stringify(data);

	// if (!PRODUCTION) return JSON.stringify(data);
	// // log("stringifying data", data);
	// const compressed = pako.deflate(JSON.stringify(data));
	// log("compressed", compressed);
	// return compressed;
};
