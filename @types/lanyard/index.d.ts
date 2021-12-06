/* eslint-disable */
/* eslint-disable */

declare module "lanyard" {
	export type SocketMessageRecieve =
		| {
				op: 1;
				d: { heartbeat_interval: number };
		  }
		| {
				op: 0;
				seq: 1;
				t: "INIT_STATE";
				d: Presance;
		  }
		| {
				op: 0;
				seq: 2;
				t: "PRESENCE_UPDATE";
				d: Presance;
		  };

	export type SocketMessageSend =
		| {
				d: { subscribe_to_id: string };
				op: 2;
		  }
		| {
				op: 3;
		  };

	export interface Presance {
		spotify: any;
		listening_to_spotify: boolean;
		kv: Record<string, string>;
		discord_user: DiscordUser;
		discord_status: string;
		activities: Activity[];
		active_on_discord_web: boolean;
		active_on_discord_mobile: boolean;
		active_on_discord_desktop: boolean;
	}

	export interface DiscordUser {
		username: string;
		public_flags: number;
		id: string;
		discriminator: string;
		avatar: string | null;
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
		start: number;
	}

	export interface Assets {
		small_text: string;
		small_image: string;
		large_text: string;
		large_image: string;
	}

	export interface Emoji {
		name: string;
		id?: string;
		animated?: boolean;
	}
}
