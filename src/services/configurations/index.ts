import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from 'stores/firebase';
import type { Configuration, Price, Pump } from 'models/configurations';
import { configuration } from 'stores/configurations';

export const configRef = collection(db, 'configurations');

export const getConfiguration = async (): Promise<
	Configuration | undefined
> => {
	const configDoc = await getDoc(doc(configRef, 'configuration'));

	return (configDoc.data() as Configuration) ?? undefined;
};

const addConfiguration = async (config: Configuration): Promise<void> => {
	await setDoc(doc(configRef, 'configuration'), config);
	configuration.set(config);
};

export const addPrice = async (name: string, value: string): Promise<void> => {
	const config = await getConfiguration();

	const priceId = name
		.toLowerCase()
		.replaceAll(' ', '-')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');

	const price: Price = {
		id: priceId,
		name,
		value
	};

	if (!config) {
		await addConfiguration({
			prices: [price],
			pumps: []
		});
		return;
	}

	if (config.prices.find((price) => price.id === priceId)) {
		throw new Error('Price already exists');
	}

	const newConfig = {
		...config,
		prices: [...config.prices, price]
	};

	await setDoc(doc(configRef, 'configuration'), newConfig);
	configuration.set(newConfig);
};

export const removePrice = async (priceId: string): Promise<void> => {
	const config = await getConfiguration();

	if (!config) {
		return;
	}

	const newConfig = {
		...config,
		prices: config.prices.filter((price) => price.id !== priceId)
	};

	await setDoc(doc(configRef, 'configuration'), newConfig);
	configuration.set(newConfig);
};

export const addPump = async (name: string, counter: string): Promise<void> => {
	const config = await getConfiguration();

	const pumpId = name
		.toLowerCase()
		.replaceAll(' ', '-')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');

	const pump: Pump = {
		id: pumpId,
		name,
		counter
	};

	if (!config) {
		await addConfiguration({
			prices: [],
			pumps: [pump]
		});
		return;
	}

	if (config.pumps.find((pump) => pump.id === pumpId)) {
		throw new Error('Pump already exists');
	}

	const newConfig = {
		...config,
		pumps: [...config.pumps, pump]
	};

	await setDoc(doc(configRef, 'configuration'), newConfig);
	configuration.set(newConfig);
};

export const removePump = async (pumpId: string): Promise<void> => {
	const config = await getConfiguration();

	if (!config) {
		return;
	}

	const newConfig = {
		...config,
		pumps: config.pumps.filter((pump) => pump.id !== pumpId)
	};

	await setDoc(doc(configRef, 'configuration'), newConfig);
	configuration.set(newConfig);
};
