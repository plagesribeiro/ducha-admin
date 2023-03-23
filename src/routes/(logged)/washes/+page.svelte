<script lang="ts">
	import { success } from 'components/Toast.svelte';
	import { deleteDoc, doc } from 'firebase/firestore';
	import { db } from 'stores/firebase';
	import {
		paymentOptions,
		shiftOptions,
		washes,
		type Wash
	} from 'stores/wash';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Button,
		Search,
		Label,
		Select
	} from 'flowbite-svelte';
	import { DateInput } from 'date-picker-svelte';
	import {
		ChevronDoubleDown,
		ChevronDoubleUp,
		Icon,
		MagnifyingGlass
	} from 'svelte-hero-icons';

	let employeeName = '';
	let date1: Date;
	let date2: Date;
	let shift = '';
	let payment = '';
	let filterIsOpen = false;

	let filteredWashes: Wash[] = [];

	$: if ($washes) {
		filteredWashes = $washes;
	}

	const deleteWash = async (id: string) => {
		await deleteDoc(doc(db, 'wash', id));
		success('Lavagem deletada com sucesso!');
	};

	const filter = async () => {
		console.log('filtrando');
		filteredWashes = $washes.filter((wash) => {
			if (employeeName) {
				if (
					!wash.employeeName
						.toLowerCase()
						.normalize('NFD')
						.replace(/[\u0300-\u036f]/g, '')
						.includes(
							employeeName
								.toLowerCase()
								.normalize('NFD')
								.replace(/[\u0300-\u036f]/g, '')
						)
				) {
					return false;
				}
			}
			if (date1) {
				if (wash.date < date1) {
					return false;
				}
			}
			if (date2) {
				if (wash.date > date2) {
					return false;
				}
			}
			if (shift) {
				if (wash.shift !== shift) {
					return false;
				}
			}
			if (payment) {
				if (wash.payment !== payment) {
					return false;
				}
			}
			return true;
		});
	};
</script>

<div
	class="flex flex-col w-full h-full min-w-[300px] max-w-[700px] items-center justify-start py-10 px-4 gap-4 overflow-clip"
>
	{#if filterIsOpen}
		<Button
			color="light"
			class="w-full"
			on:click={() => (filterIsOpen = false)}
		>
			<div class="flex items-center gap-1">
				<spam>Fechar</spam>
				<Icon size={'20'} src={ChevronDoubleUp} />
			</div>
		</Button>
		<div
			class="bg-gray-200 dark:bg-gray-800 w-full flex flex-col items-center p-4 rounded-lg gap-3 items-center justify-center"
		>
			<div class="flex w-full gap-3">
				<Label class="w-1/2"
					>Pagamento:
					<Select
						class="mt-2"
						items={paymentOptions}
						bind:value={payment}
						size="sm"
					/>
				</Label>
				<Label class="w-1/2"
					>Turno:
					<Select
						class="mt-2"
						items={shiftOptions}
						bind:value={shift}
						size="sm"
					/>
				</Label>
			</div>

			<Label class="w-full"
				>Nome do funcionário:
				<Search
					size="sm"
					class="mt-2"
					bind:value={employeeName}
					placeholder="Digite o nome do funcionário"
				/>
			</Label>

			<Button class="w-full max-w-md" on:click={() => filter()}>
				<div class="flex items-center gap-1">
					<spam>Filtrar</spam>
					<Icon size={'20'} src={MagnifyingGlass} />
				</div>
			</Button>
		</div>
	{:else}
		<Button
			color="light"
			class="w-full"
			on:click={() => (filterIsOpen = true)}
		>
			<div class="flex items-center gap-1">
				<spam>Filtros</spam>
				<Icon size={'20'} src={ChevronDoubleDown} />
			</div>
		</Button>
	{/if}
	<div
		class="w-full bg-gray-200 dark:bg-gray-800 rounded-lg overflow-auto shadow-xl"
	>
		{#if filteredWashes.length}
			<Table hoverable={true}>
				<TableHead>
					<TableHeadCell>Nome</TableHeadCell>
					<TableHeadCell>Data</TableHeadCell>
					<TableHeadCell>Quantidade</TableHeadCell>
					<TableHeadCell />
					<TableHeadCell />
				</TableHead>
				<TableBody>
					{#each filteredWashes as wash}
						<TableBodyRow>
							<TableBodyCell>{wash.employeeName}</TableBodyCell>
							<TableBodyCell
								>{wash.date.toLocaleDateString('en-GB')}</TableBodyCell
							>
							<TableBodyCell>{wash.quantity}</TableBodyCell>
							<!--<TableBodyCell>
								<a
									href="washes/wash/{wash.id}"
									class="font-medium text-center text-blue-600 hover:underline dark:text-blue-500 cursor-pointer"
								>
									Editar
								</a>
							</TableBodyCell>-->
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
	<div class="w-full flex items-center justify-center">
		<Button href="washes/wash" color="green">Cadastrar nova lavagem</Button>
	</div>
</div>

<style>
</style>
