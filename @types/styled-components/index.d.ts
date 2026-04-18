/* eslint-disable */

import "styled-components";

declare module "styled-components" {
	export interface DefaultTheme {
		colors: {
			primary: string;
			background: string;
			surface: string;
			outline: string;
			error: string;
			spotify: string;
			gray: string;
		};
		breakpoints: {
			mobile: string;
		};
	}
}
