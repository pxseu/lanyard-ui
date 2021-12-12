import { Activity, Emoji } from "lanyard";
import { PLACEHOLDER, UNKNOWN_ALBUM } from "./consts";

const resolveAsset = (asset?: string, applicationId?: string, id?: string) => {
	const isSpotify = id?.startsWith("spotify:") || false;

	// if asset is a spotify asset resolve it
	if (isSpotify && asset) return `https://i.scdn.co/image/${asset?.split(":")[1]}`;

	if (isSpotify) return UNKNOWN_ALBUM;

	// if no asset is provided return default image
	if (!applicationId || !asset) return PLACEHOLDER;

	// if asset is a url return it
	return `https://cdn.discordapp.com/app-assets/${applicationId}/${asset}.webp`;
};

const resolveEmoji = (emoji: Emoji) => {
	// if emoji doesnt have id fallback to twemoji to resolve
	if (!emoji.id)
		return `https://twemoji.maxcdn.com/v/13.1.0/svg/${Array.from(emoji.name)
			.map((em) => em.codePointAt(0)?.toString(16))
			.join("-")}.svg`;
	// if emoji is not animated use png
	if (!emoji.animated) return `https://cdn.discordapp.com/emojis/${emoji.id}.png`;

	// if emoji is animated use gif
	return `https://cdn.discordapp.com/emojis/${emoji.id}.gif`;
};

export const resolveActivity = (activity: Activity | undefined, type: "large" | "small") => {
	if (!activity) return PLACEHOLDER;

	if (type !== "large")
		return activity?.assets?.small_image
			? resolveAsset(activity?.assets?.small_image, activity?.application_id)
			: null;

	if (activity.type === 4 && !!activity.emoji) return resolveEmoji(activity.emoji);

	return resolveAsset(activity.assets?.large_image, activity.application_id, activity.id);
};
