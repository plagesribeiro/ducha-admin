import { readable } from 'svelte/store';
import { onSnapshot } from 'firebase/firestore';
import { authentication } from 'stores/firebase';
import type { Employee } from 'models/employee';
import { employeeRef } from 'services/employee';

export const employees = readable<Employee[] | undefined>(undefined, (set) => {
	authentication.subscribe((user) => {
		if (!user) {
			set(undefined);
			return;
		}
		onSnapshot(employeeRef, (snapshot) => {
			let employees: Employee[] = [];

			employees = snapshot.docs.map((doc) => {
				const data = doc.data() as { name: string; role: string };
				const employee = {
					id: doc.id,
					name: data.name,
					role: data.role
				} as Employee;
				return employee;
			});

			snapshot.docChanges().forEach((change) => {
				if (change.type === 'added') {
					if (
						!employees.find((employee) => employee.id === change.doc.id)
					) {
						const data = change.doc.data() as {
							name: string;
							role: string;
						};
						const newEmploye = {
							id: change.doc.id,
							name: data.name,
							role: data.role
						} as Employee;
						employees.push(newEmploye);
					}
				}
				if (change.type === 'modified') {
					const data = change.doc.data() as { name: string; role: string };
					const modifiedEmploye = {
						id: change.doc.id,
						name: data.name,
						role: data.role
					} as Employee;
					employees = employees.map((employee) => {
						if (employee.id === modifiedEmploye.id) {
							return modifiedEmploye;
						}
						return employee;
					});
				}
				if (change.type === 'removed') {
					const data = change.doc.data() as { name: string; role: string };
					const removedEmploye = {
						id: change.doc.id,
						name: data.name,
						role: data.role
					} as Employee;
					employees = employees.filter(
						(employee) => employee.id !== removedEmploye.id
					);
				}
			});

			set(employees);
		});
	});
});
