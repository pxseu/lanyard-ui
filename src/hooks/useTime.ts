/* eslint-disable @typescript-eslint/indent */

import { Timestamps } from "lanyard";
import { useEffect, useState } from "react";

const padding = (n: number) => (n < 10 ? `0${n}` : n);

const DAY = 1000 * 60 * 60 * 24;
const HOUR = 1000 * 60 * 60;
const MINUTE = 1000 * 60;
const SECOND = 1000;

type Times =
	| {
			start: string;
			end: null;
			completion: null;
	  }
	| {
			start: string;
			end: string;
			completion: number;
	  };

const getTime = (timestamps?: Timestamps): Times | null => {
	if (!timestamps) return null;

	const { start, end } = timestamps;

	if (!start && !end) return null;

	const now = new Date();
	const startDate = new Date(start);
	const miliseconds = now.getTime() - startDate.getTime();
	const days = Math.floor(miliseconds / DAY);
	const hours = Math.floor((miliseconds % DAY) / HOUR);
	const minutes = Math.floor((miliseconds % HOUR) / MINUTE);
	const seconds = Math.floor((miliseconds % MINUTE) / SECOND);

	if (!end) {
		if (days > 0)
			return { start: `${days > 1 ? `${days} days` : `${days} day`} elapsed`, end: null, completion: null };

		return {
			start: `${hours ? `${hours}:` : ""}${padding(minutes)}:${padding(seconds)} elapsed`,
			end: null,
			completion: null,
		};
	}

	const endDate = new Date(end);
	const endMiliseconds = endDate.getTime() - startDate.getTime();
	const endHours = Math.floor(endMiliseconds / HOUR);
	const endMinutes = Math.floor((endMiliseconds % HOUR) / MINUTE);
	const endSeconds = Math.floor((endMiliseconds % MINUTE) / SECOND);

	return {
		start: `${hours ? `${hours}:` : ""}${padding(minutes)}:${padding(seconds)}`,
		end: `${endHours ? `${endHours}:` : ""}${padding(endMinutes)}:${padding(endSeconds)}`,
		completion: Math.floor((miliseconds / endMiliseconds) * 10000) / 100,
	};
};

export const useTime = (timestamps?: Timestamps) => {
	const [time, setTime] = useState<Times | null>(getTime(timestamps));

	useEffect(() => {
		if (!timestamps) return setTime(null);

		const interval = setInterval(() => {
			setTime(getTime(timestamps));
		}, 200);

		return () => clearInterval(interval);
	}, [timestamps]);

	return time;
};
