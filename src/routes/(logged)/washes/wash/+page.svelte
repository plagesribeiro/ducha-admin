<script lang="ts">
	import { danger, success } from 'components/Toast.svelte';
	import { DateInput } from 'date-picker-svelte';
	import { doc, setDoc } from 'firebase/firestore';
	import { v4 as uuidv4 } from 'uuid';
	import {
		Button,
		FloatingLabelInput,
		Select,
		Label,
		Input,
		Dropdown,
		DropdownItem
	} from 'flowbite-svelte';
	import { employees } from 'stores/employee';
	import {
		paymentOptions,
		shiftOptions,
		sizeOptions,
		washRef
	} from 'stores/wash';
	import { goto } from '$app/navigation';

	let date: Date = new Date();
	let employeeId: string = '';
	let employeeName: string = '';
	let shift: 'manha' | 'tarde' | 'noite' = 'manha';
	let size: 'pequeno' | 'medio' | 'grande' = 'pequeno';
	let payment: 'dinheiro' | 'credito' | 'debito' | 'vale' = 'dinheiro';
	let value: number = 10;
	let quantity: number = 1;

	$: filteredEmployees = $employees.filter((employee) => {
		if (!employeeName) {
			return false;
		} else {
			return employee.name
				.toLowerCase()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.includes(
					employeeName
						.toLowerCase()
						.normalize('NFD')
						.replace(/[\u0300-\u036f]/g, '')
				);
		}
	});

	const addWash = async () => {
		if (employee) {
			employeeId = employee.id;
		} else {
			danger('Funcionário não encontrado!');
			employeeId = '';
			return;
		}

		const washId = uuidv4();
		const newEmployee = {
			id: washId,
			employeeId,
			employeeName,
			date,
			shift,
			size,
			payment,
			quantity
		};

		await setDoc(doc(washRef, washId), newEmployee);

		employeeName = '';
		success('Lavagem adicionada com sucesso!');
		goto('/washes');
	};

	$: employee = $employees.find(
		(employee) =>
			employee.name
				.toLowerCase()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '') ===
			employeeName
				.toLowerCase()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
	);
</script>

<form
	on:submit={addWash}
	class="w-full h-full p-8  min-w-[236px] max-w-[700px] flex flex-col gap-4 overflow-auto"
>
	<div class="z-[99999]">
		<div class="font-sm font-semibold">Data:</div>
		<DateInput closeOnSelection format="dd/MM/yyyy" bind:value={date} />
	</div>

	<FloatingLabelInput
		style="outlined"
		type="text"
		label="Nome do funcionário"
		bind:value={employeeName}
		required
	/>
	<Dropdown
		frameClass="min-w-[236px] max-w-[236px] !m-x-8 !overflow-hidden"
		class="bg-gray-200    overflow-clip"
	>
		{#each filteredEmployees as employee}
			<DropdownItem
				on:click={() => {
					employeeId = employee.id;
					employeeName = employee.name;
				}}>{employee.name}</DropdownItem
			>
		{/each}
	</Dropdown>

	<div class="flex w-full justify-between items-center gap-4">
		<Label class="w-1/2"
			>Pagamento:
			<Select
				class="mt-2"
				items={paymentOptions}
				bind:value={payment}
				required
			/>
		</Label>

		<Label class="w-1/2"
			>Turno:
			<Select
				class="mt-2"
				items={shiftOptions}
				bind:value={shift}
				required
			/>
		</Label>
	</div>

	<div class="flex w-full justify-between items-center gap-4">
		<Label class="w-1/2"
			>Tamanho:
			<Select class="mt-2" items={sizeOptions} bind:value={size} required />
		</Label>

		<Label class="w-1/2"
			>Quantidade:
			<Input let:props class="mt-2">
				<input type="number" {...props} bind:value={quantity} required />
			</Input>
		</Label>
	</div>

	<Button type="submit">Adicionar</Button>
</form>
