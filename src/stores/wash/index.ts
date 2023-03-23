import { authentication, db } from 'stores/firebase';
import { readable } from 'svelte/store';
import { collection, onSnapshot } from 'firebase/firestore';

export const washRef = collection(db, 'wash');

type Wash = {
	id: string;
	employeeId: string;
	employeeName: string;
	date: Date;
	shift: 'manhã' | 'tarde' | 'noite';
	size: 'pequeno' | 'medio' | 'grande';
	payment: string;
	notes: string;
};

const initialWashes: Wash[] = [];

export const washes = readable<Wash[]>(initialWashes, (set) => {
	authentication.subscribe((user) => {
		if (!user) {
			set(initialWashes);
			return;
		}
		onSnapshot(washRef, (snapshot) => {
			let washes: Wash[] = [];

			washes = snapshot.docs.map((doc) => {
				const wash = doc.data() as Wash;
				wash.id = doc.id;
				return wash;
			});

			snapshot.docChanges().forEach((change) => {
				if (change.type === 'added') {
					if (!washes.find((wash) => wash.id === change.doc.id)) {
						const newEmploye = change.doc.data() as Wash;
						newEmploye.id = change.doc.id;
						washes.push(newEmploye);
					}
				}
				if (change.type === 'modified') {
					const modifiedEmploye = change.doc.data() as Wash;
					modifiedEmploye.id = change.doc.id;
					washes = washes.map((wash) => {
						if (wash.id === modifiedEmploye.id) {
							return modifiedEmploye;
						}
						return wash;
					});
				}
				if (change.type === 'removed') {
					const removedEmploye = change.doc.data() as Wash;
					removedEmploye.id = change.doc.id;
					washes = washes.filter((wash) => wash.id !== removedEmploye.id);
				}
			});

			set(washes);
		});
	});
});
