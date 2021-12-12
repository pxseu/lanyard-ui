import { DiscordUser } from "lanyard";

export const resolveAvatar = (user?: DiscordUser) => {
	if (!user) return null;

	// fallback to default avatar based on user's discriminator
	if (!user.avatar) return `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator) % 5}.png`;

	// if hash starts with a_ it's animated
	if (user.avatar.startsWith("a_"))
		return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif?size=256`;

	// use a webp image
	return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=256`;
};
