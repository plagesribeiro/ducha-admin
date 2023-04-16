import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from 'stores/firebase';
import type { Employee, Role } from 'models/employee';

export const employeeRef = collection(db, 'employees');

export const getEmployee = async (
	employeeId: string
): Promise<Employee | undefined> => {
	const employeeDoc = await getDoc(doc(employeeRef, employeeId));

	const { name, role } = employeeDoc.data() as { name: string; role: string };

	return ({ id: employeeId, name, role } as Employee) ?? undefined;
};

export const addEmployee = async (name: string, role: Role): Promise<void> => {
	const employeeId = name
		.toLowerCase()
		.replaceAll(' ', '-')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');

	const employeeDoc = await getDoc(doc(employeeRef, employeeId));
	if (employeeDoc.exists()) {
		throw new Error('Funcionário já existe');
	}

	const employee: Employee = {
		id: employeeId,
		name,
		role
	};

	await setDoc(doc(employeeRef, employee.id), {
		name: employee.name,
		role: employee.role
	});
};

export const removeEmployee = async (employeeId: string): Promise<void> => {
	// TODO não deixar deletar funcionarios que ja tenham feito lavagens, para checar isso é preciso chamar a função employeeHasWashes do services/day

	await setDoc(doc(employeeRef, employeeId), {
		deleted: true
	});
};
