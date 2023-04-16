<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { Button, Card, FloatingLabelInput, Spinner } from 'flowbite-svelte';
	import { authentication } from 'stores/firebase';
	import { configuration } from 'stores/configurations';
	import CreatePriceModal from 'components/CreatePriceModal.svelte';
	import { Icon, Trash } from 'svelte-hero-icons';
	import { removePrice, removePump } from 'services/configurations';
	import { success } from 'components/Toast.svelte';
	import { isAdmin } from 'stores/firebase';
	import CreatePumpModal from 'components/CreatePumpModal.svelte';

	$: if (browser && $authentication !== undefined) {
		if (!$isAdmin) {
			goto('/auth/logout');
		}
	}

	const addInitConfiguration = () => {
		configuration.set({
			prices: [],
			pumps: []
		});
	};

	let openCreatePriceModal = false;
	const showCreatePriceModal = () => {
		openCreatePriceModal = true;
	};

	const deletePrice = async (id: string) => {
		try {
			await removePrice(id);
			success('Preço removido com sucesso');
		} catch (e: any) {
			console.error(e);
		}
	};

	let openCreatePumpModal = false;
	const showCreatePumpModal = () => {
		openCreatePumpModal = true;
	};

	const deletePump = async (id: string) => {
		try {
			await removePump(id);
			success('Bomba removida com sucesso');
		} catch (e: any) {
			console.error(e);
		}
	};
</script>

<CreatePumpModal bind:open={openCreatePumpModal} />
<CreatePriceModal bind:open={openCreatePriceModal} />
{#if $configuration === undefined}
	<Spinner class="mt-4" />
{:else if $configuration === null}
	<Button on:click={addInitConfiguration} class="mt-10"
		>Adicionar Primeira Configuração</Button
	>
{:else}
	<div class="w-full flex flex-wrap justify-evenly gap-4 p-4">
		<Card class="w-full">
			<div
				class="w-full h-full flex flex-col items-start justify-between text-gray-800 gap-2"
			>
				<h2 class="text-xl font-semibold">Preços:</h2>

				{#each $configuration.prices as price}
					<div
						class="flex gap-3 items-center justify-between w-full hover:bg-gray-200 px-2 py-1 rounded-lg"
					>
						<div class="flex gap-1">
							<p class="font-semibold">{price.name}:</p>
							<p>{price.value} reais</p>
						</div>

						<div
							class="cursor-pointer"
							on:click={() => deletePrice(price.id)}
							on:keydown
						>
							<Icon src={Trash} size="18" class="text-red-500" />
						</div>
					</div>
				{/each}
				<Button class="w-full mt-4" on:click={showCreatePriceModal}
					>Adicionar Preço</Button
				>
			</div>
		</Card>

		<Card class="w-full">
			<div
				class="w-full h-full flex flex-col items-start justify-between text-gray-800 gap-2"
			>
				<h2 class="text-xl font-semibold">Bombas:</h2>

				{#each $configuration.pumps as pump}
					<div
						class="flex gap-3 items-center justify-between w-full hover:bg-gray-200 px-2 py-1 rounded-lg"
					>
						<div class="flex gap-1">
							<p class="font-semibold">{pump.name}:</p>
							<p>{pump.counter}</p>
						</div>

						<div
							class="cursor-pointer"
							on:click={() => deletePump(pump.id)}
							on:keydown
						>
							<Icon src={Trash} size="18" class="text-red-500" />
						</div>
					</div>
				{/each}
				<Button class="w-full mt-4" on:click={showCreatePumpModal}
					>Adicionar Bomba</Button
				>
			</div>
		</Card>
	</div>

	<Button href="/admin/employees">Acessar cadastro de funcionários</Button>
{/if}
