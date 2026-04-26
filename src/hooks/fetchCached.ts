import { useEffect, useState } from "react";
import { ADD_MEDIA_URL, DEFAULT_AVATAR_PATH, PLACEHOLDER_PRESENCE } from "@/utils/consts";

const fetchUrl = async (url: string, signal: AbortSignal) => {
	const response = await fetch(url, { signal });
	const blob = await (response.ok ? response.blob() : Promise.reject(new Error("Network response was not ok.")));
	return URL.createObjectURL(blob);
};

export const useFetchCached = (url: string | null): string | undefined => {
	const [data, setData] = useState<string | undefined>();
	const [oldUrl, setOldUrl] = useState<string | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: its fine
	useEffect(() => {
		if (url === oldUrl) return;

		const controller = new AbortController();
		let objectUrl: string | null = null;

		if (!url) {
			setOldUrl(url);
			setData(undefined);
			return;
		}

		if (url.startsWith(`${ADD_MEDIA_URL}/${PLACEHOLDER_PRESENCE.discord_user.id}`)) {
			setOldUrl(url);
			setData(undefined);
			return;
		}

		if (url.startsWith(DEFAULT_AVATAR_PATH)) {
			setOldUrl(url);
			setData(url);
			return;
		}

		setData(undefined);
		setOldUrl(null);

		void fetchUrl(url, controller.signal)
			.then((fetchedUrl) => {
				objectUrl = fetchedUrl;
				setOldUrl(url);
				setData(fetchedUrl);
			})
			.catch((error: unknown) => {
				if (error instanceof DOMException && error.name === "AbortError") {
					return;
				}

				setData(undefined);
				setOldUrl(null);
			});

		return () => {
			controller.abort();
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};
	}, [url]);

	return data;
};
