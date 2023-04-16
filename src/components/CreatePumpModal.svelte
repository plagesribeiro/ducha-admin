<script lang="ts">
	import { Button, Modal, FloatingLabelInput } from 'flowbite-svelte';
	import { addPump } from 'services/configurations';
	import { danger, success } from './Toast.svelte';

	export let open: boolean = false;

	const config = {
		name: '',
		counter: ''
	};

	const validate = () => {
		if (!config.counter || parseInt(config.counter) < 0) {
			danger('Preço inválido');
			return false;
		}

		if (!config.name || config.name.length < 3) {
			danger('Nome inválido');
			return false;
		}

		return true;
	};

	const savePump = async () => {
		try {
			if (!validate()) {
				return;
			}

			await addPump(config.name, config.counter);
			success('Bomba adicionada com sucesso');
			closeModal();
		} catch (e: any) {
			danger(e.message);
		}
	};

	const closeModal = () => {
		open = false;
		config.name = '';
		config.counter = '';
	};
</script>

<Modal bind:open size="xs" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-6" on:submit={savePump}>
		<h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">
			Adicionando bomba
		</h3>

		<div class="flex w-full justify-between items-center gap-4">
			<FloatingLabelInput
				style="outlined"
				type="text"
				label="Nome"
				bind:value={config.name}
				required
			/>

			<FloatingLabelInput
				style="outlined"
				type="number"
				label="Contador"
				bind:value={config.counter}
				required
			/>
		</div>

		<Button type="submit" class="w-full">Salvar</Button>
	</form>
</Modal>
