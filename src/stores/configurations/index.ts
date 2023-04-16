import { authentication } from 'stores/firebase';
import { writable } from 'svelte/store';
import type { Configuration } from 'models/configurations';
import { getConfiguration } from 'services/configurations';

export const configuration = writable<Configuration | undefined | null>(
	undefined,
	(set) => {
		authentication.subscribe((user) => {
			if (!user) {
				set(undefined);
				return;
			}

			getConfiguration().then((config) => {
				if (config) {
					set(config);
				} else {
					set(null);
				}
			});
		});
	}
);
