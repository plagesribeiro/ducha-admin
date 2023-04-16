<script lang="ts">
	import { employees } from 'stores/employees';
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
	import CreateEmployeeModal from 'components/CreateEmployeeModal.svelte';

	let openCreateEmployeeModal = false;
	let searchName = '';

	$: filteredEmployees = $employees?.filter((employee) =>
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
	);

	const deleteEmployee = async (id: string) => {
		/*const employeeHaveWashes = $washes.find((wash) => wash.employeeId === id);
		if (employeeHaveWashes) {
			danger('Funcionário não pode ser deletado pois possui lavagens!');
			return;
		}
		await deleteDoc(doc(db, 'employee', id));
		success('Funcionário deletado com sucesso!');*/
	};
</script>

<CreateEmployeeModal bind:open={openCreateEmployeeModal} />
<div
	class="flex flex-col w-full h-full min-w-[300px] max-w-[700px] items-center justify-start py-10 px-4 gap-4 overflow-clip"
>
	<Button class="w-full" on:click={() => (openCreateEmployeeModal = true)}
		>Adicionar Funcionário</Button
	>
	<Search bind:value={searchName} class="shadow-xl" />
	<div
		class="w-full bg-gray-200 dark:bg-gray-800 rounded-lg overflow-auto shadow-xl"
	>
		{#if filteredEmployees?.length}
			<Table hoverable={true}>
				<TableHead>
					<TableHeadCell>Nome</TableHeadCell>
					<TableHeadCell>Cargo</TableHeadCell>
					<TableHeadCell />
				</TableHead>
				<TableBody>
					{#each filteredEmployees as employee}
						<TableBodyRow>
							<TableBodyCell>{employee.name}</TableBodyCell>
							<TableBodyCell>{employee.role}</TableBodyCell>
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
