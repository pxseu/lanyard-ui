import type { Presence } from "lanyard";
import {
	DEFAULT_ID_VALUE,
	KEY_ID,
	KEY_TOKEN,
	LEGACY_PRESENCE_KEY,
	PLACEHOLDER_PRESENCE,
	PRESENCE_KEY,
	USER_REGEX,
} from "./consts";

const getRawId = (): string | null => {
	// check if path has an id
	const path = window.location.pathname.split("/")[1];

	// if path has a valid id use it
	if (path && USER_REGEX.test(path)) return path;

	// get id from local storage
	const id = localStorage.getItem(KEY_ID);
	return id;
};

export const getId = (): string => {
	return getRawId() || DEFAULT_ID_VALUE;
};

export const getToken = (): string | null => {
	return localStorage.getItem(KEY_TOKEN);
};

const idMatchesPresence = (presence: Presence): boolean => {
	const stored = getRawId();

	if (presence.discord_user.id === stored) return true;

	return false;
};

const getRawPresence = (): Presence | null => {
	const rawPresence = localStorage.getItem(PRESENCE_KEY) ?? localStorage.getItem(LEGACY_PRESENCE_KEY);

	if (!rawPresence) return null;

	try {
		const presence = JSON.parse(rawPresence) as Presence;

		if (!localStorage.getItem(PRESENCE_KEY)) {
			localStorage.setItem(PRESENCE_KEY, rawPresence);
		}
		localStorage.removeItem(LEGACY_PRESENCE_KEY);

		return presence;
	} catch {
		localStorage.removeItem(PRESENCE_KEY);
		localStorage.removeItem(LEGACY_PRESENCE_KEY);
		return null;
	}
};

export const getPresence = () => {
	const presence = getRawPresence();

	if (presence && idMatchesPresence(presence)) return presence;

	return PLACEHOLDER_PRESENCE;
};
