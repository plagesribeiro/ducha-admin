import type { Price } from 'models/configurations';

export const shiftOptions: { value: 'manha' | 'tarde'; name: string }[] = [
	{ value: 'manha', name: 'Manhã' },
	{ value: 'tarde', name: 'Tarde' }
];

export type Wash = {
	employeeName: string;
	shift: 'manha' | 'tarde';
	priceName: string;
	quantity: string;
};

type DayPrices = {
	priceName: string;
	priceValue: string;
};

export type Day = {
	date: number;
	pumps: {
		pumpName: string;
		init: string;
		final: string;
	}[];
	washes: Wash[];
	prices: DayPrices[];
	maintenance: string;
};
