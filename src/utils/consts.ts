const PREFIX_AND_VERSION = "lanyard:v1:" as const;

export const PRODUCTION = process.env.REACT_APP_ENV?.toLowerCase() === "production";
export const KEY_ID = `${PREFIX_AND_VERSION}id` as const;
export const KEY_TOKEN = `${PREFIX_AND_VERSION}token` as const;
export const PRESANCE_KEY = `${PREFIX_AND_VERSION}last_presance` as const;
export const PLACEHOLDER = "/assets/placeholder.png" as const;
export const DEFAULT_ID_VALUE = "819287687121993768" as const;
export const USER_REGEX = /^\d{17,}$/;
export const SOCKET_URL = PRODUCTION ? "wss://lanyard.rest/socket?compression=zlib_json" : "wss://lanyard.rest/socket";
