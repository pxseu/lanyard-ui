import type { DiscordUser } from "lanyard";
import { DEFAULT_AVATAR_PATH } from "./consts";

const resolveDefaultAvatar = (user: DiscordUser) => {
	let index: number;

	if (user.discriminator !== "0") {
		index = parseInt(user.discriminator, 10) % 5;
	} else {
		const math = (BigInt(user.id) >> BigInt(22)) % BigInt(6);

		index = Number(math);
	}

	return `${DEFAULT_AVATAR_PATH}/${index}.png`;
};

export const resolveAvatar = (user?: DiscordUser) => {
	if (!user) return null;

	// fallback to default avatar based on user's discriminator
	if (!user.avatar) return resolveDefaultAvatar(user);

	// if hash starts with a_ it's animated
	if (user.avatar.startsWith("a_"))
		return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif?size=512`;

	// use a webp image
	return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=512`;
};

export const resolveDecoration = (hovering: boolean, user?: DiscordUser) => {
	if (!user?.avatar_decoration_data) return null;

	return `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration_data.asset}?passthrough=${hovering}&size=512`;
};
