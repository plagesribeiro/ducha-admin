<script lang="ts">
	import PumpModal from 'components/PumpModal.svelte';
	import { DateInput } from 'date-picker-svelte';
	import { Button, FloatingLabelInput, Modal } from 'flowbite-svelte';
	import { pumps } from 'stores/pump';

	export let date: Date = new Date();

	let createPumpModal = false;

	const createPump = () => {};
</script>

<div class="w-full h-full flex flex-col items-center justify-center gap-4">
	<div class="flex gap-3 items-center">
		<spam class="font-semibold">Dia: </spam>
		<DateInput closeOnSelection format="dd/MM/yyyy" bind:value={date} />
	</div>

	{#if $pumps}
		{#if $pumps.length}
			{#each $pumps as pump}
				<div class="flex items-center">
					<spam class="font-semibold">{pump.name} </spam>
					<spam class="font-semibold"
						>{': '} {pump.counter?.toString()}
					</spam>
				</div>
			{/each}
			<Button on:click={() => (createPumpModal = true)}
				>Cadastrar Bomba</Button
			>
			{#if createPumpModal}
				<PumpModal bind:createPumpModal />
			{/if}
		{:else}
			<div class="flex gap-3 items-center">
				<spam class="font-semibold">Nenhuma bomba cadastrada</spam>
				<Button on:click={() => (createPumpModal = true)}
					>Cadastrar Bomba</Button
				>
				{#if createPumpModal}
					<PumpModal bind:createPumpModal />
				{/if}
			</div>
		{/if}
	{/if}
</div>
