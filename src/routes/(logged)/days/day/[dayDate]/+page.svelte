<script lang="ts">
	import {
		Button,
		Input,
		Select,
		Dropdown,
		DropdownItem,
		Spinner,
		Alert
	} from 'flowbite-svelte';
	import { shiftOptions, type Day } from 'models/day';
	import { danger, success } from 'components/Toast.svelte';
	import { isAdmin } from 'stores/firebase';
	import { configuration } from 'stores/configurations';
	import { ArrowRight, Icon } from 'svelte-hero-icons';
	import { employees } from 'stores/employees';
	import { goto } from '$app/navigation';
	import { deleteDay, updateDay } from 'services/day/index.js';
	import { lastDay } from 'stores/days/index.js';

	export let data;
	const { day } = data;

	let searchName = '';

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const canEdit =
		$isAdmin || (today.getTime() - day?.date) / (1000 * 3600 * 24) <= 3;

	const priceOptions = day?.prices.map((price) => ({
		name: price.priceName,
		value: price.priceValue
	}));

	$: totalPumps =
		day?.pumps.reduce(
			(acc, pump) => acc + parseInt(pump.final) - parseInt(pump.init),
			0
		) - parseInt(day?.maintenance);
	$: totalWashes = day?.washes.reduce(
		(acc, wash) => acc + parseInt(wash.quantity),
		0
	);

	$: status =
		totalPumps === totalWashes
			? 'correct'
			: totalPumps > totalWashes
			? 'lessWashes'
			: 'moreWashes';

	$: formattedDate = day?.date
		? new Date(day.date).toLocaleDateString('pt-BR')
		: today.toLocaleDateString('pt-BR');

	$: filteredEmployees =
		$employees?.filter((employee) =>
			employee.name
				.toLowerCase()
				.replaceAll(' ', '-')
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.includes(
					searchName
						.toLowerCase()
						.replaceAll(' ', '-')
						.normalize('NFD')
						.replace(/[\u0300-\u036f]/g, '')
				)
		) || [];

	const validate = () => {
		if (!day) {
			danger('Ocorreu um erro ao salvar o dia');
			return false;
		}

		if (parseInt(day.maintenance) < 0) {
			danger('O valor de manutenção não pode ser menor que 0');
			return false;
		}

		// TODO Tickets validation

		return true;
	};

	const saveDay = async () => {
		try {
			if (!validate()) {
				return;
			}
			await updateDay(day);
			success('Dia salvo com sucesso');
			//goto('/days');
		} catch (error) {
			danger('Ocorreu um erro ao salvar o dia');
		}
	};

	const createWash = async () => {
		// colocar um objeto no inicio do array day.washes
		const newWash = {
			employeeName: '',
			quantity: '0',
			shift: shiftOptions[0].value,
			priceName: $configuration?.prices[0].name
				? $configuration?.prices[0].name
				: 'Nenhum'
		};

		if (day) {
			day.washes = [...day.washes, newWash];
		}
	};

	const removeLastWash = () => {
		if (day) {
			day.washes = day.washes.slice(0, -1);
		}
	};

	const removeDay = async () => {
		try {
			await deleteDay(day);
			success('Dia removido com sucesso');
			goto('/days');
		} catch (error) {
			danger('Ocorreu um erro ao remover o dia');
		}
	};
</script>

{#if $configuration === undefined}
	<Spinner class="mt-4" />
{:else if $configuration === null || $configuration.prices.length === 0 || $configuration.pumps.length === 0}
	<div
		class="w-full h-full max-w-2xl flex flex-col gap-4 items-center text-center justify-center"
	>
		<h1
			class=" w-full overflow-clip text-red-500 font-bold text-xl text-wrap"
		>
			Os preços e as bombas devem ser configurados antes de adicionar dias,
			entre em contato com o administrador para realizar a configuração
		</h1>
		{#if $isAdmin}
			<Button href="/admin">Acessar painel de administração</Button>
		{/if}
	</div>
{:else if $lastDay !== undefined}
	<form
		class="flex flex-col gap-2 mt-4 w-full h-full overflow-auto max-w-xl p-1"
		on:submit={saveDay}
	>
		<div
			class="flex items-center gap-2 text-xl font-medium text-gray-900 dark:text-white p-0"
		>
			<span class="font-bold">Dia: </span>{formattedDate}
			{#if $lastDay && $lastDay.date === day.date}
				<Button color="red" size="sm" on:click={removeDay}
					>Remover Dia</Button
				>
			{/if}
		</div>

		<div class="w-full flex gap-1 items-center">
			<span class="font-bold text-lg">Preços:</span>
			{#each day.prices as price}
				<span
					><span class="font-semibold">{price.priceName}:</span>
					{price.priceValue}R$</span
				>;
			{/each}
		</div>

		{#if status === 'correct'}
			<Alert color="green">
				<span class="font-medium">Sucesso!</span> As lavagens batem com as bombas
			</Alert>
		{:else if status === 'lessWashes'}
			<Alert color="red">
				<span class="font-medium">EITA!</span> Existem mais contagem nas bombas
				do que lavagens
			</Alert>
		{:else if status === 'moreWashes'}
			<Alert color="yellow">
				<span class="font-medium">Cuidado!</span> Existem mais lavagens do que
				contagem nas bombas
			</Alert>
		{/if}

		<div class="flex flex-col gap-2 border border-gray-400 p-3 rounded-lg">
			{#each day.pumps as pump}
				<div class="flex gap-2 items-center w-full justify-start">
					<span class="font-semibold text-lg truncate"
						>{pump.pumpName}:
					</span>
					<span>{pump.init}</span>
					<Icon src={ArrowRight} size="20" />
					<!-- bind input value to the newDay.pumps in the pump position-->
					<span>{pump.final}</span>
				</div>
			{/each}
		</div>

		<div class="flex flex-col gap-2 border border-gray-400 p-3 rounded-lg">
			{#each day.washes as wash}
				<div class="flex items-center justify-between gap-2">
					<div class="!w-[15%]">
						<Input size="sm" type="number" bind:value={wash.quantity} />
					</div>
					<Input
						class="!w-[35%]"
						size="sm"
						style="outlined"
						type="text"
						placeholder="Nome"
						bind:value={wash.employeeName}
						required
					/>
					<Dropdown
						size="sm"
						frameClass="min-w-[236px] max-w-[236px] !m-x-8 !overflow-hidden"
						class="bg-gray-200    overflow-clip"
					>
						{#each filteredEmployees as employee}
							<DropdownItem
								size="sm"
								on:click={() => {
									wash.employeeName = employee.name;
								}}>{employee.name}</DropdownItem
							>
						{/each}
					</Dropdown>
					<Select
						size="sm"
						class="!w-[20%]"
						items={shiftOptions}
						disabled={!canEdit}
						bind:value={wash.shift}
						required
					/>
					<Select
						size="sm"
						class="!w-[20%]"
						items={priceOptions}
						disabled={!canEdit}
						bind:value={wash.priceName}
						required
					/>
				</div>
			{/each}
			<div class="w-full flex gap-2 items-center justify-center">
				<Button
					type="button"
					color="green"
					class="w-fit"
					disabled={!canEdit}
					on:click={createWash}>Adicionar lavagem</Button
				>
				<Button
					type="button"
					color="red"
					class="w-fit"
					disabled={!canEdit}
					on:click={removeLastWash}>Remover última lavagem</Button
				>
			</div>
		</div>

		<div class="flex gap-2 items-center">
			<div class="w-[50px]">
				<Input
					class="p-0 m-0 "
					size="sm"
					type="number"
					bind:value={day.maintenance}
					disabled={!$isAdmin}
				/>
			</div>
			<span>Manutenção</span>
		</div>

		<Button type="submit" class="w-full">Salvar</Button>
	</form>
{/if}
