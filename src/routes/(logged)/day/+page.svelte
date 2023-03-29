<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { success } from 'components/Toast.svelte';
	import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
	import { Button, FloatingLabelInput, Spinner } from 'flowbite-svelte';
	import { db } from 'stores/firebase';
	import { onMount } from 'svelte';
	import MaskInput from 'svelte-input-mask/MaskInput.svelte';

	type Wash = {
		employeeName: string;
		quantity: number;
		size: string;
		shift: 'manhã' | 'tarde';
	};
	type Day = {
		pumps: [{ pumpName: string; init: number; final: number }];
		maintenance: number;
		tickets: number;
		prices: [{ size: string; value: number }];
		washes: [Wash];
	};

	let prices = [
		{ size: 'P', value: 10 },
		{ size: 'M', value: 15 },
		{ size: 'G', value: 20 }
	];
	let pumps = [
		{ name: 'Bomba 1', init: 0, final: 0 },
		{ name: 'B2', init: 1542, final: 1600 }
	];

	let maintenance = 0;
	let tickets = 0;
	let washes: Wash[] = [];

	const dayRef = collection(db, 'days');

	const todayDate = new Date();
	const todayDay =
		todayDate.getDate() < 10
			? `0${todayDate.getDate()}`
			: todayDate.getDate();
	const todayMonth =
		todayDate.getMonth() + 1 < 10
			? `0${todayDate.getMonth() + 1}`
			: todayDate.getMonth() + 1;
	const todayYear = todayDate.getFullYear();
	const todayDateStr = `${todayDay}-${todayMonth}-${todayYear}`;

	const params = new URLSearchParams($page.url.searchParams);
	let date = params.get('date') || todayDateStr;

	let isValidDate = false;
	let isFutureDate = false;
	let moreThanThreeDays = false;
	let changedToValidDate = false;
	let dateWithoutInfo = false;

	let maskString = 'DD-MM-YYYY';
	let mask = '00-00-0000';

	onMount(async () => {
		loadDate();
	});

	const loadDate = async () => {
		validateDate(date);

		dateWithoutInfo = false;
		if (isValidDate && !isFutureDate) {
			const day = await getDoc(doc(dayRef, date));

			if (day.exists()) {
				pumps = day.data().pumps;
				maintenance = day.data().maintenance;
				tickets = day.data().tickets;
				prices = day.data().prices;
				washes = day.data().washes;
			} else {
				/*
				if (date === todayDateStr) {
					await setDoc(doc(dayRef, date), {
						pumps,
						maintenance,
						tickets,
						prices,
						washes
					});
					success('Dados criados com sucesso!');
				} else {
					console.log('muito antiga para criar');
					dateWithoutInfo = true;
				}*/
			}
		}
	};

	const validateDate = (strDate: any) => {
		const day = strDate.split('-')[0];
		const month = strDate.split('-')[1];
		const year = strDate.split('-')[2];
		const dateToValidate = new Date(year, month - 1, day);
		if (dateToValidate && dateToValidate.getMonth() + 1 === parseInt(month)) {
			isValidDate = true;

			if (dateToValidate > todayDate) {
				isFutureDate = true;
			} else {
				isFutureDate = false;
			}

			const threeDaysAgo = new Date();
			threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
			threeDaysAgo.setHours(0, 0, 0, 0);
			if (dateToValidate <= threeDaysAgo) {
				moreThanThreeDays = true;
			} else {
				moreThanThreeDays = false;
			}

			if (strDate !== date) {
				changedToValidDate = true;
			} else {
				changedToValidDate = false;
			}
		} else {
			isValidDate = false;
		}
	};

	let actualValue = date;
	const handleDateChange = (e: any) => {
		actualValue = e.detail.inputState.maskedValue;
		validateDate(actualValue);
	};

	const gotoOtherDate = () => {
		date = actualValue;
		validateDate(date);
		goto('/day?date=' + actualValue);
	};
</script>

<div class=" flex flex-col w-full h-full items-center overflow-auto p-4 gap-2">
	<div class="flex flex-col gap-1">
		<MaskInput
			class="mt-4 p-2 border border-gray-300 rounded-md text-center w-fit"
			alwaysShowMask
			{maskString}
			{mask}
			bind:value={date}
			on:change={handleDateChange}
		/>

		{#if isValidDate && !isFutureDate}
			{#if changedToValidDate}
				<Button on:click={gotoOtherDate}>Alterar data</Button>
			{/if}
		{:else}
			<div class="mt-2 text-sm text-center text-red-500">
				<span class="font-semibold">Data inválida</span>
			</div>
		{/if}
	</div>

	{#if isValidDate && !isFutureDate && !changedToValidDate}
		<div class="flex gap-3 w-full items-start">
			<div class="flex flex-col items-center gap-6 bg-white p-4 rounded-lg">
				{#each pumps as pump}
					<div class="flex items-center gap-4 ">
						<div class="font-semibold truncate max-w-[100px]">
							{pump.name}
						</div>
						<FloatingLabelInput
							class="!w-20"
							size="small"
							bind:value={pump.init}
							label="Inicial"
							type="number"
						/>
						<FloatingLabelInput
							class="!w-20"
							size="small"
							bind:value={pump.final}
							label="Final"
							type="number"
						/>
					</div>
				{/each}

				<div class="flex w-full justify-between">
					<FloatingLabelInput
						class="!w-20"
						size="small"
						bind:value={maintenance}
						label="Manutenção"
						type="number"
						disabled
					/>
					<FloatingLabelInput
						class="!w-20"
						size="small"
						bind:value={tickets}
						label="Tickets"
						type="number"
					/>
				</div>
			</div>
		</div>
	{/if}
</div>
