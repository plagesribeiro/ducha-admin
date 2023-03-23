import { db } from '../firebase';
import { readable } from 'svelte/store';
import { collection, onSnapshot } from 'firebase/firestore';
import { authentication } from 'stores/firebase';

export const employeeRef = collection(db, 'employee');

export type Employee = {
	id: string;
	name: string;
	phone: string;
};

const initialEmployees: Employee[] = [];

export const employees = readable<Employee[]>(initialEmployees, (set) => {
	authentication.subscribe((user) => {
		if (!user) {
			set(initialEmployees);
			return;
		}
		onSnapshot(employeeRef, (snapshot) => {
			let employees: Employee[] = [];

			employees = snapshot.docs.map((doc) => {
				const employee = doc.data() as Employee;
				employee.id = doc.id;
				return employee;
			});

			snapshot.docChanges().forEach((change) => {
				if (change.type === 'added') {
					if (
						!employees.find((employee) => employee.id === change.doc.id)
					) {
						const newEmploye = change.doc.data() as Employee;
						newEmploye.id = change.doc.id;
						employees.push(newEmploye);
					}
				}
				if (change.type === 'modified') {
					const modifiedEmploye = change.doc.data() as Employee;
					modifiedEmploye.id = change.doc.id;
					employees = employees.map((employee) => {
						if (employee.id === modifiedEmploye.id) {
							return modifiedEmploye;
						}
						return employee;
					});
				}
				if (change.type === 'removed') {
					const removedEmploye = change.doc.data() as Employee;
					removedEmploye.id = change.doc.id;
					employees = employees.filter(
						(employee) => employee.id !== removedEmploye.id
					);
				}
			});

			set(employees);
		});
	});
});
