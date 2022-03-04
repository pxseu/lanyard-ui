import { useEffect, useState } from "react";
import { SORT_KEY } from "utils/consts";

type SortTypes = "asc" | "desc" | null;

interface Required {
	0: string;
}

const sortFunc = (arr: Required[], sort: SortTypes) => {
	if (!sort) return arr;
	return arr.sort((a, b) => {
		if (sort === "asc") return a[0] > b[0] ? 1 : -1;
		return a[0] < b[0] ? 1 : -1;
	});
};

export const useSort = () => {
	const [type, setType] = useState<SortTypes>(null);
	const sorter = <T extends Required[]>(arr: T) => sortFunc(arr, type) as T;

	const toggleSort = () => {
		if (type === "desc") return setType("asc");

		return setType("desc");
	};

	useEffect(() => {
		const stored = localStorage.getItem(SORT_KEY);

		return setType((stored ?? "desc") as SortTypes);
	}, []);

	useEffect(() => {
		localStorage.setItem(SORT_KEY, String(type));
	}, [type]);

	return { sorter, type, toggleSort } as const;
};
