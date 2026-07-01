/* eslint-disable */
/* eslint-disable */

declare module "lanyard" {
	export type SocketMessageReceive =
		| {
				op: 1;
				d: { heartbeat_interval: number };
		  }
		| {
				op: 0;
				seq: 1;
				t: "INIT_STATE";
				d: Presence;
		  }
		| {
				op: 0;
				seq: 2;
				t: "PRESENCE_UPDATE";
				d: Presence;
		  };

	export type SocketMessageSend =
		| {
				d: { subscribe_to_id: string };
				op: 2;
		  }
		| {
				op: 3;
		  }
		| {
				op: 4;
				d: { unsubscribe_from_id: string };
		  };

	export interface Presence {
		spotify: Record<string, unknown> | null;
		listening_to_spotify: boolean;
		kv: Record<string, string>;
		discord_user: DiscordUser;
		discord_status: "online" | "idle" | "dnd" | "offline";
		activities: Activity[];
		active_on_discord_web: boolean;
		active_on_discord_mobile: boolean;
		active_on_discord_desktop: boolean;
		last_seen?: number;
	}

	export type Clan =
		| {
				tag: string;
				badge: string;
				identity_enabled: true;
				identity_guild_id: string;
		  }
		| {
				tag: null;
				badge: null;
				identity_enabled: false;
				identity_guild_id: null;
		  };

	export interface Collectible {
		asset: string;
		expires_at: number | null;
		label: string;
		palette: string;
		sku_id: string;
	}
	export interface DiscordUser {
		username: string;
		global_name: string;
		display_name: string;
		public_flags: number;
		id: string;
		discriminator: string;
		avatar: string | null;
		avatar_decoration_data: {
			asset: string;
			sku_id: string;
		} | null;
		primary_guild: Clan;
		collectibles: Record<string, Collectible>;
	}

	export interface Activity {
		type: number;
		timestamps: Timestamps;
		state: string;
		name: string;
		id: string;
		details: string;
		created_at: number;
		assets: Assets;
		application_id: string;
		sync_id?: string;
		emoji?: Emoji;
	}

	export interface Timestamps {
		start?: number;
		end?: number;
	}

	export interface Assets {
		small_text?: string;
		small_image?: string;
		large_text?: string;
		large_image?: string;
	}

	export interface Emoji {
		name: string;
		id?: string;
		animated?: boolean;
	}
}
