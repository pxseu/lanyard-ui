/* eslint-disable */

import "styled-components";

declare module "styled-components" {
	export interface DefaultTheme {
		colors: {
			primary: "#fafafa";
			background: "#202020";
			presance: "#2a2a2a";
			outline: "#acc0ff";
			error: "#af0000";
			spotify: "#1DB954";
			gray: "#828282";
		};
		breakpoints: {
			mobile: "320px";
		};
	}
}
