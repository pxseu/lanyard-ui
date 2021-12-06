import { PLACEHOLDER } from "./consts";

export const resolveAsset = (asset?: string, applicationId?: string) => {
	// split to check if asset is a spotify asset
	const split = asset?.split(":");

	// if asset is a spotify asset resolve it
	if (split?.length && split[0] === "spotify") return `https://i.scdn.co/image/${split[1]}`;

	// if no asset is provided return default image
	if (!asset || !applicationId) return PLACEHOLDER;

	// if asset is a url return it
	return `https://cdn.discordapp.com/app-assets/${applicationId}/${asset}.webp`;
};
