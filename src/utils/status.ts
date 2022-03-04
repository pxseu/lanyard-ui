export const colorFromStatus = (status: string): string => {
	switch (status) {
		case "online":
			return "#55d87e";
		case "idle":
			return "#d8a855";
		case "dnd":
			return "#e34a4d";
		default:
			return "#808080";
	}
};
