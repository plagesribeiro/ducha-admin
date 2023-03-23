<script lang="ts">
	import { danger, success } from 'components/Toast.svelte';
	import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
	import { db } from 'stores/firebase';
	import { employees, employeeRef } from 'stores/employee';
	import { v4 as uuidv4 } from 'uuid';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Button,
		Search
	} from 'flowbite-svelte';
	import { washes } from 'stores/wash';

	let searchName = '';
	$: filteredEmployees = $employees.filter(
		// ignorar maiusculas e minusculas e acentos e filtrar por nome e telefone
		(employee) =>
			employee.name
				.toLowerCase()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.includes(
					searchName
						.toLowerCase()
						.normalize('NFD')
						.replace(/[\u0300-\u036f]/g, '')
				)
	);

	const addEmployee = async (name: string) => {
		if (!name) {
			danger('Nome não pode ser vazio!');
			return;
		}
		const employeeExists = $employees.find(
			(employee) => employee.name === name.trim()
		);

		if (employeeExists) {
			danger('Funcionário já cadastrado!');
			return;
		}

		const employeeId = uuidv4();
		await setDoc(doc(employeeRef, employeeId), {
			name: name
		});
		searchName = '';
		success('Funcionário adicionado com sucesso!');
	};

	const deleteEmployee = async (id: string) => {
		// checar se o id existe na store washes.
		const employeeHaveWashes = $washes.find((wash) => wash.employeeId === id);
		if (employeeHaveWashes) {
			danger('Funcionário não pode ser deletado pois possui lavagens!');
			return;
		}
		await deleteDoc(doc(db, 'employee', id));
		success('Funcionário deletado com sucesso!');
	};
</script>

<div
	class="flex flex-col w-full h-full min-w-[300px] max-w-[700px] items-center justify-start py-10 px-4 gap-4 overflow-clip"
>
	<Search bind:value={searchName} class="shadow-xl">
		{#if !filteredEmployees.length}
			<Button on:click={() => addEmployee(searchName)}>Adicionar</Button>
		{/if}
	</Search>
	<div
		class="w-full bg-gray-200 dark:bg-gray-800 rounded-lg overflow-auto shadow-xl"
	>
		{#if filteredEmployees.length}
			<Table hoverable={true}>
				<TableHead>
					<TableHeadCell>Nome</TableHeadCell>

					<TableHeadCell />
				</TableHead>
				<TableBody>
					{#each filteredEmployees as employee}
						<TableBodyRow>
							<TableBodyCell>{employee.name}</TableBodyCell>
							<TableBodyCell>
								<div
									on:click={() => deleteEmployee(employee.id)}
									on:keydown
									class="font-medium text-center text-red-600 hover:underline dark:text-red-500 cursor-pointer"
								>
									Excluir
								</div>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		{:else}
			<div class="flex p-4 w-full font-semibold justify-center">
				Não foram encontrados funcionários
			</div>
		{/if}
	</div>
</div>
