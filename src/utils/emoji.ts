import { Emoji } from "lanyard";

export const resolveEmoji = (emoji: Emoji) => {
	// if emoji doesnt have id fallback to twemoji to resolve
	if (!emoji.id) return `https://twemoji.maxcdn.com/v/13.1.0/svg/${emoji.name.codePointAt(0)!.toString(16)}.svg`;

	// if emoji is not animated use png
	if (!emoji.animated) return `https://cdn.discordapp.com/emojis/${emoji.id}.png`;

	// if emoji is animated use gif
	return `https://cdn.discordapp.com/emojis/${emoji.id}.gif`;
};
