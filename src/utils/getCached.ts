import { Presence } from "lanyard";
import { DEFAULT_ID_VALUE, KEY_ID, KEY_TOKEN, PLACEHOLDER_PRESANCE, PRESANCE_KEY, USER_REGEX } from "./consts";

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

const idMatchesPresence = (presance: Presence): boolean => {
	const stored = getRawId();

	if (presance?.discord_user?.id === stored) return true;

	return false;
};

const getRawPresence = (): Presence | null => {
	const presance = localStorage.getItem(PRESANCE_KEY);

	try {
		if (presance) return JSON.parse(presance);
		return null;
	} catch (e) {
		throw e;
		localStorage.removeItem(PRESANCE_KEY);
		return null;
	}
};

export const getPresence = () => {
	const presance = getRawPresence();

	if (presance && idMatchesPresence(presance)) return presance;

	return PLACEHOLDER_PRESANCE;
};
