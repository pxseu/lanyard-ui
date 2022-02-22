import { useEffect, useState } from "react";
import { SORT_KEY } from "utils/consts";

type SortTypes = "asc" | "desc";

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
	const [sort, setSort] = useState<SortTypes>("desc");
	const sorter = <T extends Required[]>(arr: T) => sortFunc(arr, sort) as T;

	const toggleSort = () => {
		if (sort === "desc") return setSort("asc");

		return setSort("desc");
	};

	useEffect(() => {
		const stored = localStorage.getItem(SORT_KEY);

		return setSort(stored as SortTypes);
	}, []);

	useEffect(() => {
		localStorage.setItem(SORT_KEY, String(sort));
	}, [sort]);

	return { sorter, sort, toggleSort } as const;
};
