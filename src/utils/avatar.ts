import { DiscordUser } from "lanyard";

export const resolveAvatar = (user: DiscordUser) => {
	// if user has an avatar hash use it
	if (user.avatar) return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=256`;

	// fallback to default avatar based on user's discriminator
	return `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator) % 5}.png`;
};
