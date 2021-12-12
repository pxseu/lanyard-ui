import { useEffect, useState } from "react";
import { DEFAULT_AVATAR_PATH } from "utils/consts";

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
		if (url.startsWith(DEFAULT_AVATAR_PATH)) return setDataWithUrl(url);

		fetch(url)
			.then((response) =>
				response.ok ? response.blob() : Promise.reject(new Error("Network response was not ok.")),
			)
			.then((blob) => mounted && setDataWithUrl(URL.createObjectURL(blob)))
			.catch(() => mounted && setData(undefined));

		return () => {
			mounted = false;
		};
	}, [url]);

	return data;
};
