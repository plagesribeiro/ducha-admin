<script lang="ts">
	import { danger, success } from 'components/Toast.svelte';
	import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
	import { db } from 'stores/firebase';
	import { washes, washRef } from 'stores/wash';
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

	let employeeName = '';
	let day = '';
	let month = '';
	let year = '';
	let shift = '';
	let payment = '';
	$: filteredWashes = $washes.filter(
		// filtrar de acordo com as variaveis acima
		(wash) =>
			wash.employeeName.toLowerCase().includes(employeeName.toLowerCase()) &&
			wash.date.toDateString().toLowerCase().includes(day.toLowerCase()) &&
			wash.date.toDateString().toLowerCase().includes(month.toLowerCase()) &&
			wash.date.toDateString().toLowerCase().includes(year.toLowerCase()) &&
			wash.shift.toLowerCase().includes(shift.toLowerCase()) &&
			wash.payment.toLowerCase().includes(payment.toLowerCase())
	);

	const deleteWash = async (id: string) => {
		await deleteDoc(doc(db, 'wash', id));
		success('Lavagem deletada com sucesso!');
	};
</script>

<div
	class="flex flex-col w-full h-full min-w-[300px] max-w-[700px] items-center justify-start py-10 px-4 gap-4 overflow-clip"
>
	<div class="w-full flex items-center justify-end">
		<Button href="washes/wash" color="green">Cadastrar nova lavagem</Button>
	</div>

	<div
		class="w-full bg-gray-200 dark:bg-gray-800 rounded-lg overflow-auto shadow-xl"
	>
		{#if filteredWashes.length}
			<Table hoverable={true}>
				<TableHead>
					<TableHeadCell>Nome</TableHeadCell>

					<TableHeadCell />
				</TableHead>
				<TableBody>
					{#each filteredWashes as wash}
						<TableBodyRow>
							<TableBodyCell>{wash.date}</TableBodyCell>
							<TableBodyCell>
								<div
									on:click={() => deleteWash(wash.id)}
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
				Não foram encontradas lavagens
			</div>
		{/if}
	</div>
</div>
