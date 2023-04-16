export type Employee = {
	id: string;
	name: string;
	role: Role;
};

export const roleOptions = [
	{ value: 'ducheiro', name: 'Ducheiro' },
	{ value: 'gerente', name: 'Gerente' },
	{ value: 'frentista', name: 'Frentista Ducheiro' },
	{ value: 'ajudante', name: 'Ajudante' }
];

export type Role = 'ducheiro' | 'gerente' | 'frentista' | 'ajudante';
