<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Button
	} from 'flowbite-svelte';
	import { daysPage } from 'stores/days';

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const openModal = (dateTime: number) => {
		goto(`/days/day/${dateTime}`);
	};
</script>

<Table hoverable={true}>
	<TableHead>
		<TableHeadCell />
		<TableHeadCell>Dia</TableHeadCell>
		<TableHeadCell />
	</TableHead>
	<TableBody tableBodyClass="divide-y">
		{#if $daysPage?.length && $daysPage.length > 0}
			{#each $daysPage as day}
				<TableBodyRow>
					<TableBodyCell>
						<!-- number in order -->
						{$daysPage.indexOf(day) + 1}
					</TableBodyCell>
					<TableBodyCell
						>{new Date(day.date).toLocaleDateString(
							'pt-br'
						)}</TableBodyCell
					>

					{#if (today.getTime() - day.date) / (1000 * 3600 * 24) <= 3}
						<TableBodyCell>
							<Button on:click={() => openModal(day.date)} outline
								>Edit</Button
							>
						</TableBodyCell>
					{:else}
						<TableBodyCell>
							<Button on:click={() => openModal(day.date)} outline
								>View</Button
							>
						</TableBodyCell>
					{/if}
				</TableBodyRow>
			{/each}
		{/if}
	</TableBody>
</Table>
