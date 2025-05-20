import type { DiscordUser } from "lanyard";

interface Badge {
	id: string;
	url: string;
}

const BADGES = {
	STAFF: 1 << 0,
	PARTNER: 1 << 1,
	HYPESQUAD: 1 << 2,
	BUG_HUNTER_LEVEL_1: 1 << 3,
	HYPESQUAD_ONLINE_HOUSE_1: 1 << 6,
	HYPESQUAD_ONLINE_HOUSE_2: 1 << 7,
	HYPESQUAD_ONLINE_HOUSE_3: 1 << 8,
	PREMIUM_EARLY_SUPPORTER: 1 << 9,
	TEAM_PSEUDO_USER: 1 << 10,
	BUG_HUNTER_LEVEL_2: 1 << 14,
	VERIFIED_BOT: 1 << 16,
	VERIFIED_DEVELOPER: 1 << 17,
	CERTIFIED_MODERATOR: 1 << 18,
	BOT_HTTP_INTERACTIONS: 1 << 19,
	ACTIVE_DEVELOPER: 1 << 22,
} as const;

const BADGE_NAMES = {
	[BADGES.STAFF]: "staff",
	[BADGES.PARTNER]: "partner",
	[BADGES.HYPESQUAD]: "hypesquad",
	[BADGES.BUG_HUNTER_LEVEL_1]: "bug_hunter_level_1",
	[BADGES.HYPESQUAD_ONLINE_HOUSE_1]: "hypesquad_bravery",
	[BADGES.HYPESQUAD_ONLINE_HOUSE_2]: "hypesquad_brilliance",
	[BADGES.HYPESQUAD_ONLINE_HOUSE_3]: "hypesquad_balance",
	[BADGES.PREMIUM_EARLY_SUPPORTER]: "premium_early_supporter",
	[BADGES.TEAM_PSEUDO_USER]: "team_pseudo_user",
	[BADGES.BUG_HUNTER_LEVEL_2]: "bug_hunter_level_2",
	[BADGES.VERIFIED_BOT]: "verified_bot",
	[BADGES.VERIFIED_DEVELOPER]: "verified_developer",
	[BADGES.CERTIFIED_MODERATOR]: "certified_moderator",
	[BADGES.BOT_HTTP_INTERACTIONS]: "bot_http_interactions",
	[BADGES.ACTIVE_DEVELOPER]: "active_developer",
} as const;

export const resolveBadges = (user: DiscordUser): Badge[] => {
	const badges: Badge[] = [];

	// Check each badge flag
	for (const [flag, name] of Object.entries(BADGE_NAMES)) {
		if (user.public_flags & Number(flag)) {
			badges.push({
				id: name,
				url: `/assets/badges/${name}.png`,
			});
		}
	}

	// hacky way to check if the user has a nitro avatar
	if (user.avatar && user.avatar.startsWith("a_")) {
		badges.push({
			id: "nitro",
			url: `/assets/badges/nitro.png`,
		});
	}

	return badges;
};
