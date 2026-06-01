import type { Activity, Emoji } from "lanyard";
import {
	ADD_MEDIA_URL,
	PLACEHOLDER,
	TWEMOJI_CDN,
	UNKNOWN_ALBUM,
} from "@/utils/consts";

const resolveAsset = (applicationId?: string, asset?: string) => {
	const split = asset?.split(":") || [];

	// sicne the asset split on colon it can be spotify or ext
	if (split.length > 1) {
		switch (split[0]) {
			case "spotify":
				// if the asset is 1 it's unknown
				if (split[1] === "1") return UNKNOWN_ALBUM;

				// it's probably fine
				return `https://i.scdn.co/image/${split[1]}`;
			case "mp":
				// external discord asset thing
				return `https://media.discordapp.net/${split[1]}`;
			case "twitch":
				// twitch stream preview
				return `https://static-cdn.jtvnw.net/previews-ttv/live_user_${split[1]}.png`;
			case "youtube":
				// youtube live-stream thumbnail
				return `https://i.ytimg.com/vi/${split[1]}/hqdefault_live.jpg`;

			default:
				return PLACEHOLDER;
		}
	}

	if (applicationId && !asset)
		return `${ADD_MEDIA_URL}/app-icons/${applicationId}.webp?size=512`;

	// if no asset is provided return default image
	if (!applicationId || !asset) return PLACEHOLDER;

	// if asset is a url return it
	return `https://cdn.discordapp.com/app-assets/${applicationId}/${asset}.webp?size=512`;
};

// jdecked/twemoji follows twemoji's `grabTheRightIcon` rule: drop the FE0F
// variation selector unless the sequence is a ZWJ join. A few older sequences
// are stored minimally-qualified anyway and need an explicit override.
const TWEMOJI_OVERRIDES: Record<string, string> = {
	// eye in speech bubble (1F441 FE0F 200D 1F5E8 FE0F)
	"1f441-fe0f-200d-1f5e8-fe0f": "1f441-200d-1f5e8",
};

const resolveEmoji = (emoji: Emoji) => {
	// if emoji doesnt have id fallback to twemoji to resolve
	if (!emoji.id) {
		// twemoji keeps FE0F only for ZWJ sequences; strip it otherwise
		const normalized = emoji.name.includes("\u200D")
			? emoji.name
			: emoji.name.replace(/\uFE0F/g, "");

		const codepoints = Array.from(normalized)
			.map((em) => em.codePointAt(0)?.toString(16))
			.join("-");

		// TWEMOJI_CDN already ends with a slash
		return `${TWEMOJI_CDN}${TWEMOJI_OVERRIDES[codepoints] ?? codepoints}.svg`;
	}

	// if emoji is not animated use png
	if (!emoji.animated)
		return `https://cdn.discordapp.com/emojis/${emoji.id}.png`;

	// if emoji is animated use gif
	return `https://cdn.discordapp.com/emojis/${emoji.id}.gif`;
};

export const resolveActivity = (
	activity: Activity | undefined,
	type: "large" | "small",
) => {
	if (!activity) return PLACEHOLDER;

	if (type !== "large")
		return activity?.assets?.small_image
			? resolveAsset(activity?.application_id, activity?.assets?.small_image)
			: null;

	if (activity.type === 4 && activity.emoji)
		return resolveEmoji(activity.emoji);

	const largeImage =
		activity?.assets?.large_image ??
		(activity?.id?.startsWith("spotify:") ? activity.id : undefined);

	return resolveAsset(activity.application_id, largeImage);
};
