import { useEffect, useState } from "react";
import { SORT_KEY } from "@/utils/consts";

type SortTypes = "asc" | "desc" | null;
type SortableEntry = readonly [string, ...unknown[]];

const sortFunc = <T extends SortableEntry>(arr: T[], sort: SortTypes) => {
	if (!sort) return arr;
	return [...arr].sort((a, b) => {
		if (sort === "asc") return a[0].localeCompare(b[0]);
		return b[0].localeCompare(a[0]);
	});
};

export const useSort = () => {
	const [type, setType] = useState<SortTypes>(null);
	const sorter = <T extends SortableEntry[]>(arr: T) => sortFunc(arr, type) as T;
	const toggleSort = () => {
		setType((currentType) => (currentType === "desc" ? "asc" : "desc"));
	};

	useEffect(() => {
		const stored = localStorage.getItem(SORT_KEY);
		setType(stored === "asc" || stored === "desc" ? stored : "desc");
	}, []);

	useEffect(() => {
		if (!type) return;
		localStorage.setItem(SORT_KEY, type);
	}, [type]);

	return { sorter, type, toggleSort } as const;
};
