import { Presence } from "lanyard";

const PREFIX_AND_VERSION = "lanyard:v1:" as const;

export const RECONNECT_INTERVAL = 500;
export const MAX_RECONNECT_TIME = 5_000;
export const PRODUCTION =
	process.env.REACT_APP_ENV?.toLowerCase() === "production" && localStorage.getItem("lanyard:debug") !== "true";
export const KEY_ID = `${PREFIX_AND_VERSION}id` as const;
export const KEY_TOKEN = `${PREFIX_AND_VERSION}token` as const;
export const PRESANCE_KEY = `${PREFIX_AND_VERSION}last_presance` as const;
export const SORT_KEY = `${PREFIX_AND_VERSION}sort` as const;
export const PLACEHOLDER = "/assets/placeholder.svg" as const;
export const UNKNOWN_ALBUM = "/assets/album.svg" as const;
export const BANNER_PATH = "https://dcdn.dstn.to/banners" as const;
export const DEFAULT_AVATAR_PATH = "https://cdn.discordapp.com/embed/avatars";
export const DEFAULT_ID_VALUE = "819287687121993768" as const;
export const USER_REGEX = /^\d{17,}$/;
export const KEY_REGEX = /^[a-z\d_]+$/i;
export const KEY_MAX_LENGTH = 255;
export const VALUE_MAX_LENGTH = 30_000;
export const MAX_KEYS_AMMOUNT = 512;
export const LANYARD_BASE_URL = "https://api.lanyard.rest/v1" as const;
export const SOCKET_URL = PRODUCTION ? "wss://lanyard.rest/socket?compression=zlib_json" : "wss://lanyard.rest/socket";
export const AUTHOR_URL = "https://github.com/pxseu" as const;
export const REPOSITORY_URL = `${AUTHOR_URL}/lanyard-ui` as const;
export const PLACEHOLDER_PRESANCE = {
	active_on_discord_desktop: false,
	active_on_discord_mobile: false,
	active_on_discord_web: false,
	kv: {},
	discord_user: {
		avatar: null,
		discriminator: "0".repeat(4),
		id: "0".repeat(17),
		username: "username",
		public_flags: 0,
	},
	activities: [],
	spotify: null,
	discord_status: "offline",
	listening_to_spotify: false,
} as Presence;
