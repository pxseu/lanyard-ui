export const stringFromType = (type: number) => {
	switch (type) {
		case 0:
			return "Playing";
		case 1:
			return "Streaming";
		case 2:
			return "Listening to";
		case 3:
			return "Watching";
		default:
			return "";
	}
};
