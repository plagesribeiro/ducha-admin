import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	limit,
	orderBy,
	query,
	setDoc,
	updateDoc,
	where,
	type WhereFilterOp
} from 'firebase/firestore';
import type { Day } from 'models/day';
import { updatePump } from 'services/configurations';
import { daysPage, daysPageCount, lastDay } from 'stores/days';
import { db } from 'stores/firebase';
import { v4 as uuidv4 } from 'uuid';

const dayRef = collection(db, 'days');

export const updateLastDay = async (): Promise<void> => {
	const day = await getLastDay();
	lastDay.set(day);
};

export const refreshDaysPage = async (): Promise<void> => {
	const days = await getNextPage();
	daysPage.set(days);
	daysPageCount.set(0);
};

export const getLastDay = async (): Promise<Day | null> => {
	const response = await getDocs(
		query(dayRef, orderBy('date', 'desc'), limit(1))
	);

	if (response.docs.length === 0) {
		return null;
	}

	return response.docs[0].data() as Day;
};

export const getNextPage = async (date?: Date): Promise<Day[]> => {
	let operation: WhereFilterOp = '<';
	if (!date) {
		operation = '<=';
		date = new Date();
		date.setHours(0, 0, 0, 0);
	}
	const response = await getDocs(
		query(
			dayRef,
			where('date', operation, date.getTime()),
			orderBy('date', 'desc'),
			limit(10)
		)
	);

	const newDays = response.docs.map((doc) => doc.data()) as Day[];
	return newDays;
};

export const getPreviousPage = async (date: Date): Promise<Day[]> => {
	const response = await getDocs(
		query(
			dayRef,
			where('date', '>', date.getTime()),
			orderBy('date', 'asc'),
			limit(10)
		)
	);
	return response.docs.map((doc) => doc.data()).reverse() as Day[];
};

export const getDayByDateTime = async (dateTime: number): Promise<Day> => {
	const response = await getDocs(
		query(dayRef, where('date', '==', dateTime), limit(1))
	);
	return response.docs[0]?.data() as Day;
};

export const addDay = async (day: Day): Promise<void> => {
	const id = uuidv4();

	const dayExists = await getDayByDateTime(day.date);
	if (dayExists) {
		throw new Error('A day with this date already exists');
	}

	await setDoc(doc(dayRef, id), {
		date: day.date,
		pumps: day.pumps,
		maintenance: day.maintenance,
		prices: day.prices,
		washes: day.washes
	});

	await updatePump();
	await updateLastDay();
	await refreshDaysPage();
};

export const deleteDay = async (day: Day): Promise<void> => {
	const response = await getDocs(
		query(dayRef, where('date', '==', day.date), limit(1))
	);

	const dayId = response.docs[0].id;

	await deleteDoc(doc(dayRef, dayId));

	await updatePump();
	await updateLastDay();
	await refreshDaysPage();
};

export const updateDay = async (day: Day): Promise<void> => {
	const response = await getDocs(
		query(dayRef, where('date', '==', day.date), limit(1))
	);

	const dayId = response.docs[0].id;

	await updateDoc(doc(dayRef, dayId), {
		date: day.date,
		pumps: day.pumps,
		maintenance: day.maintenance,
		prices: day.prices,
		washes: day.washes
	});

	lastDay.update((lastDay) => {
		if (lastDay?.date === day.date) {
			return day;
		}
		return lastDay;
	});

	await updatePump();
};
