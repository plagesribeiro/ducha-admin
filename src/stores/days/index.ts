import { authentication } from 'stores/firebase';
import { writable } from 'svelte/store';
import { getLastDay, getNextPage } from 'services/day';
import type { Day } from 'models/day';

export const lastDay = writable<Day | undefined | null>(undefined, (set) => {
	authentication.subscribe((user) => {
		if (!user) {
			set(undefined);
			return;
		}

		getLastDay().then((day) => {
			if (day) {
				set(day);
			} else {
				set(null);
			}
		});
	});
});

export const daysPageCount = writable<number>(0);

export const daysPage = writable<Day[] | undefined>(undefined, (set) => {
	authentication.subscribe((user) => {
		if (!user) {
			set(undefined);
			return;
		}

		getNextPage().then((days) => {
			if (days) {
				set(days);
			} else {
				set([]);
			}
		});
	});
});
