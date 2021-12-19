import { useEffect, useState } from "react";
import { DEFAULT_AVATAR_PATH, BANNER_PATH, PLACEHOLDER_PRESANCE } from "utils/consts";

const fetchUrl = async (url: string) => {
	const response = await fetch(url);
	const blob = await (response.ok ? response.blob() : Promise.reject(new Error("Network response was not ok.")));
	return URL.createObjectURL(blob);
};

export const useFetchCached = (url: string | null): string | undefined => {
	const [data, setData] = useState<string | undefined>();
	const [oldUrl, setOldUrl] = useState<string | null>(null);

	useEffect(() => {
		if (url === oldUrl) return;

		let mounted = true;

		const setDataWithUrl = (imageData: string) => {
			if (!mounted) return;
			setOldUrl(url);
			setData(imageData);
		};

		if (!url) return setOldUrl(url);
		if (url.startsWith(`${BANNER_PATH}/${PLACEHOLDER_PRESANCE.discord_user.id}`)) return setData(undefined);
		if (url.startsWith(DEFAULT_AVATAR_PATH)) return setDataWithUrl(url);

		setData(undefined);
		setOldUrl(null);

		fetchUrl(url)
			.then((blob) => mounted && setDataWithUrl(blob))
			.catch(() => mounted && setData(undefined));

		return () => {
			mounted = false;
		};
	}, [url]);

	return data;
};
