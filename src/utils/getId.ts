import { DEFAULT_ID_VALUE, KEY_ID, USER_REGEX } from "./consts";

export const getId = (): string => {
	// check if path has an id
	const path = window.location.pathname.split("/")[1];

	// if path has a valid id use it
	if (path && USER_REGEX.test(path)) return path;

	// check if storage has any id
	const storage = localStorage.getItem(KEY_ID);

	// if storage has a valid id use it
	if (storage) return storage;

	// if no id is found use the default id
	return DEFAULT_ID_VALUE;
};
