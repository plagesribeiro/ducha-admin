import { authentication, db } from 'stores/firebase';
import { readable } from 'svelte/store';
import { collection, onSnapshot } from 'firebase/firestore';

export const pumpRef = collection(db, 'pump');

export type Pump = {
	id: string;
	name: string;
	counter: number;
};

const initialPumps: Pump[] = [];

export const pumps = readable<Pump[]>(initialPumps, (set) => {
	authentication.subscribe((user) => {
		if (!user) {
			set(initialPumps);
			return;
		}
		onSnapshot(pumpRef, (snapshot) => {
			let pumps: Pump[] = [];

			pumps = snapshot.docs.map((doc) => {
				const pump = {
					...doc.data(),
					id: doc.id
				} as Pump;
				return pump;
			});

			snapshot.docChanges().forEach((change) => {
				if (change.type === 'added') {
					if (!pumps.find((pump) => pump.id === change.doc.id)) {
						const newEmploye = change.doc.data() as Pump;
						newEmploye.id = change.doc.id;
						pumps.push(newEmploye);
					}
				}
				if (change.type === 'modified') {
					const modifiedEmploye = change.doc.data() as Pump;
					modifiedEmploye.id = change.doc.id;
					pumps = pumps.map((pump) => {
						if (pump.id === modifiedEmploye.id) {
							return modifiedEmploye;
						}
						return pump;
					});
				}
				if (change.type === 'removed') {
					const removedEmploye = change.doc.data() as Pump;
					removedEmploye.id = change.doc.id;
					pumps = pumps.filter((pump) => pump.id !== removedEmploye.id);
				}
			});

			set(pumps);
		});
	});
});
