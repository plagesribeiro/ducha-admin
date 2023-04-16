export type Price = {
	id: string;
	name: string;
	value: string;
};

export type Pump = {
	id: string;
	name: string;
	counter: string;
};

export type Configuration = {
	prices: Price[];
	pumps: Pump[];
};
