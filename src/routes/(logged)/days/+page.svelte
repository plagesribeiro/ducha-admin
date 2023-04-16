<script lang="ts">
	import { getNextPage, getPreviousPage } from 'services/day';
	import { onMount } from 'svelte';
	import { Spinner, PaginationItem, Button } from 'flowbite-svelte';
	import DaysTable from 'components/DaysTable.svelte';
	import { isAdmin } from 'stores/firebase';
	import { ChevronLeft, ChevronRight, Icon } from 'svelte-hero-icons';
	import { danger } from 'components/Toast.svelte';
	import { daysPageCount, daysPage } from 'stores/days';
	import { configuration } from 'stores/configurations';
	import { goto } from '$app/navigation';

	let loading = false;

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	onMount(async () => {
		if (!$daysPage || $daysPageCount !== 0) await loadInitData();
	});

	const loadInitData = async () => {
		loading = true;
		const newDays = await getNextPage();
		$daysPage = newDays;
		$daysPageCount = 0;
		loading = false;
	};

	const nextPage = async () => {
		loading = true;
		if (!$daysPage || $daysPage.length === 0) {
			danger('Não existem mais dias para carregar');
			return;
		}
		const newDays = await getNextPage(
			new Date($daysPage[$daysPage.length - 1].date)
		);
		if (!newDays.length) {
			danger('Não existem mais dias para carregar');
		} else {
			$daysPage = newDays;
			$daysPageCount++;
		}
		loading = false;
	};

	const previousPage = async () => {
		loading = true;
		if (!$daysPage || $daysPage.length === 0) {
			danger('Não existem mais dias para carregar');
			return;
		}
		const newDays = await getPreviousPage(new Date($daysPage[0].date));
		$daysPage = newDays;
		$daysPageCount--;
		loading = false;
	};

	const openCreateDayModal = () => {
		goto('/days/day');
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
{:else}
	<div
		class="flex flex-col items-center justify-center h-full w-full overflow-clip p-4 gap-2"
	>
		{#if loading}
			<Spinner />
		{:else if !$daysPage?.length || $daysPage.length === 0}
			{#if $isAdmin}
				<span class="text-red-500 text-center"
					>Nenhum dia encontrado!
				</span>
				<Button on:click={openCreateDayModal}>
					Adicionar o primeiro dia
				</Button>
			{:else}
				<span class="text-red-500 text-center">
					Nenhum dia encontrado! Entre em contato com o administrador
				</span>
			{/if}
		{:else}
			{#if $daysPageCount === 0}
				<!-- More than 3 days ago the last added day -->
				{#if (today.getTime() - $daysPage[0].date) / (1000 * 3600 * 24) > 3}
					{#if !$isAdmin}
						<span class="text-red-500 text-center">
							Os dados estão muito desatualizados! Entre em contato com o
							administrador
						</span>
					{:else}
						<span class="text-red-500 text-center">
							Os dados estão muito desatualizados!
						</span>
						<Button on:click={openCreateDayModal}>
							Adicionar próximo dia
						</Button>
					{/if}
				{:else if $daysPage[0].date !== today.getTime()}
					<Button on:click={openCreateDayModal}
						>Adicionar próximo dia</Button
					>
				{/if}
			{/if}

			<DaysTable />

			<div class="flex space-x-3">
				{#if $daysPageCount !== 0}
					<PaginationItem
						class="flex items-center"
						on:click={previousPage}
					>
						<Icon size="18" src={ChevronLeft} />
						Previous
					</PaginationItem>
				{/if}

				{#if $daysPage.length === 10}
					<PaginationItem class="flex items-center" on:click={nextPage}>
						Next
						<Icon size="18" src={ChevronRight} />
					</PaginationItem>
				{/if}
			</div>
		{/if}
	</div>
{/if}
