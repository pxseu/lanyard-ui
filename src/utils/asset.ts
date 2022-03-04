import { Activity, Emoji } from "lanyard";
import { ADD_MEDIA_URL, PLACEHOLDER, UNKNOWN_ALBUM } from "./consts";

const resolveAsset = (applicationId?: string, asset?: string) => {
	const split = asset?.split(":") || [];

	// sicne the asset split on colon it can be spotify or ext
	if (split.length > 1) {
		if (split[0] === "spotify") {
			// if the asset is 1 it's unknown
			if (split[1] === "1") return UNKNOWN_ALBUM;

			// it's probably fine
			return `https://i.scdn.co/image/${split[1]}`;
		}

		// external discord asset thing
		return `https://media.discordapp.net/${split[1]}`;
	}

	if (applicationId && !asset) return `${ADD_MEDIA_URL}/app-icons/${applicationId}.webp?size=512`;

	// if no asset is provided return default image
	if (!applicationId || !asset) return PLACEHOLDER;

	// if asset is a url return it
	return `https://cdn.discordapp.com/app-assets/${applicationId}/${asset}.webp?size=512`;
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
			? resolveAsset(activity?.application_id, activity?.assets?.small_image)
			: null;

	if (activity.type === 4 && !!activity.emoji) return resolveEmoji(activity.emoji);

	const largeImage =
		activity?.assets?.large_image ?? (activity?.id?.startsWith("spotify:") ? activity.id : undefined);

	return resolveAsset(activity.application_id, largeImage);
};
