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
	import { addDay } from 'services/day';
	import { danger, success } from 'components/Toast.svelte';
	import { isAdmin } from 'stores/firebase';
	import { configuration } from 'stores/configurations';
	import { lastDay } from 'stores/days';
	import { ArrowRight, Icon } from 'svelte-hero-icons';
	import { employees } from 'stores/employees';
	import { goto } from '$app/navigation';

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const getDateTimeOneDayAfter = (dateTime: number) => {
		const date = new Date(dateTime);
		date.setDate(date.getDate() + 1);
		date.setHours(0, 0, 0, 0);
		return date.getTime();
	};

	const newDay: Day = {
		date: today.getTime(),
		pumps: [],
		prices: [],
		washes: [],
		maintenance: '0'
	};

	let priceOptions = [{ name: 'Nenhum', value: 'none' }];
	let searchName = '';

	// Load info when store loads
	let alreadyLoaded = false;
	$: if (
		$lastDay !== undefined &&
		$configuration &&
		$configuration.prices.length &&
		$configuration.pumps.length &&
		!alreadyLoaded
	) {
		newDay.date = $lastDay
			? getDateTimeOneDayAfter($lastDay.date)
			: today.getTime();

		const pumps = $configuration.pumps.map((pump) => ({
			pumpName: pump.name,
			init: pump.counter,
			final: pump.counter
		}));
		newDay.pumps = [...pumps];

		const prices = $configuration.prices.map((price) => {
			return {
				priceName: price.name,
				priceValue: price.value
			};
		});
		newDay.prices = [...prices];

		priceOptions = $configuration.prices.map((price) => {
			return {
				name: price.name,
				value: price.name
			};
		});

		alreadyLoaded = true;
	}

	$: totalPumps =
		newDay.pumps.reduce(
			(acc, pump) => acc + parseInt(pump.final) - parseInt(pump.init),
			0
		) - parseInt(newDay.maintenance);
	$: totalWashes = newDay.washes.reduce(
		(acc, wash) => acc + parseInt(wash.quantity),
		0
	);

	$: status =
		totalPumps === totalWashes
			? 'correct'
			: totalPumps > totalWashes
			? 'lessWashes'
			: 'moreWashes';

	$: formattedDate = newDay?.date
		? new Date(newDay.date).toLocaleDateString('pt-BR')
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
		if (!newDay) {
			danger('Ocorreu um erro ao salvar o dia');
			return false;
		}
		if (newDay.pumps.some((pump) => pump.final < pump.init)) {
			danger('O valor final não pode ser menor que o valor inicial');
			return false;
		}

		if (parseInt(newDay.maintenance) < 0) {
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
			await addDay(newDay as Day);
			success('Dia salvo com sucesso');
			goto('/days');
		} catch (e: any) {
			if (e.message.includes('already exists')) {
				danger('Já existe um dia com essa data');
			}
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

		if (newDay) {
			newDay.washes = [newWash, ...newDay.washes];
		}
	};

	const removeLastWash = () => {
		if (newDay) {
			newDay.washes = newDay.washes.slice(0, -1);
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
{:else if $lastDay && $lastDay.date === today.getTime()}
	<div
		class="w-full h-full max-w-2xl flex flex-col gap-4 items-center text-center justify-center"
	>
		<h1
			class=" w-full overflow-clip font-bold text-green-500 text-xl text-wrap"
		>
			Os dias já estão atualizados!
		</h1>
		<Button href="/days">Ver dias</Button>
	</div>
{:else}
	<form
		class="flex flex-col gap-2 mt-4 w-full h-full overflow-auto max-w-xl p-1"
		on:submit={saveDay}
	>
		<h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">
			<span class="font-bold">Dia: </span>{formattedDate}
		</h3>

		<div class="w-full flex gap-1 items-center">
			<span class="font-bold text-lg">Preços:</span>
			{#each newDay.prices as price}
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
			{#each newDay.pumps as pump}
				<div class="flex gap-2 items-center w-full justify-start">
					<span class="font-semibold text-lg truncate"
						>{pump.pumpName}:
					</span>
					<span>{pump.init}</span>
					<Icon src={ArrowRight} size="20" />
					<!-- bind input value to the newDay.pumps in the pump position-->
					<Input
						size="sm"
						class="max-w-[100px]"
						style="outlined"
						type="number"
						placeholder="Final"
						bind:value={pump.final}
						required
					/>
				</div>
			{/each}
		</div>

		<div class="flex flex-col gap-2 border border-gray-400 p-3 rounded-lg">
			{#each newDay.washes as wash}
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
						bind:value={wash.shift}
						required
					/>
					<Select
						size="sm"
						class="!w-[20%]"
						items={priceOptions}
						bind:value={wash.priceName}
						required
					/>
				</div>
			{/each}
			<div class="w-full flex items-center justify-center">
				<Button
					type="button"
					color="green"
					class="w-fit"
					on:click={createWash}>Adicionar lavagem</Button
				>
				<Button
					type="button"
					color="red"
					class="w-fit"
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
					bind:value={newDay.maintenance}
					disabled={!$isAdmin}
				/>
			</div>
			<span>Manutenção</span>
		</div>

		<Button type="submit" class="w-full">Salvar</Button>
	</form>
{/if}
