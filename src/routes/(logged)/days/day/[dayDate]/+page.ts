import { getDayByDateTime } from 'services/day/index.js';

export const load = ({ fetch, params }) => {
	//const day = await getDayByDateTime()
	const fetchDay = async (dayDate: number) => {
		const day = await getDayByDateTime(dayDate);
		return day;
	};

	return {
		day: fetchDay(parseInt(params.dayDate))
	};
};
