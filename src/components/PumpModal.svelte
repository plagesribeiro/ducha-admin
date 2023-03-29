<script lang="ts">
	import { Button, FloatingLabelInput, Modal } from 'flowbite-svelte';
	import { pumpRef, pumps } from 'stores/pump';
	import type { Pump } from 'stores/pump';
	import { danger, success } from './Toast.svelte';
	import { doc, setDoc } from 'firebase/firestore';
	import { v4 as uuidv4 } from 'uuid';
	import { onMount } from 'svelte';

	export let pumpId: string = '';

	let isCreating = false;
	let pumpName: string;
	let pumpCounter: string;
	let title: string;

	onMount(async () => {
		console.log('passou aqui');
		if (pumpId) {
			const pump = $pumps.find((pump: Pump) => pump.id === pumpId);

			if (pump) {
				isCreating = false;
				title = 'Editar Bomba';
				pumpName = pump?.name;
				pumpCounter = pump?.counter.toString();
			}
		} else {
			title = 'Cadastrar Bomba';
			isCreating = true;
			pumpName = '';
			pumpCounter = '';
		}
	});

	export let createPumpModal: boolean;

	const createPump = async () => {
		console.log('entrou');
		if (!pumpName) {
			danger('Nome não pode ser vazio!');
			return;
		}
		if (!pumpCounter) {
			danger('Valor não vazio ou inválido!');
			return;
		}

		const pumpExists = $pumps.find((pump) => pump.name === pumpName.trim());

		if (pumpExists) {
			danger('Bomba com esse nome já cadastrada!');
			return;
		}

		const pumpId = uuidv4();
		await setDoc(doc(pumpRef, pumpId), {
			name: pumpName,
			counter: pumpCounter.toString()
		});

		pumpName = '';
		success('Bomba cadastrada com sucesso!');
	};
</script>

<Modal {title} bind:open={createPumpModal} autoclose class="w-full max-w-md">
	<form class="flex flex-col gap-3 " on:submit|preventDefault|stopPropagation>
		<FloatingLabelInput
			style="outlined"
			type="text"
			label="Nome da bomba"
			bind:value={pumpName}
			required
		/>

		<FloatingLabelInput
			style="outlined"
			type="number"
			label="Valor da bomba"
			bind:value={pumpCounter}
			required
		/>

		<Button on:click={createPump} type="submit">Criar</Button>
		<Button color="alternative">Cancelar</Button>
	</form>
</Modal>
