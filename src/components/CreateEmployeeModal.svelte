<script lang="ts">
	import {
		Button,
		Modal,
		FloatingLabelInput,
		Label,
		Select
	} from 'flowbite-svelte';
	import { addEmployee } from 'services/employee';
	import { danger, success } from './Toast.svelte';
	import { roleOptions, type Role } from 'models/employee';

	export let open: boolean = false;

	const config: { name: string; role: Role } = {
		name: '',
		role: 'ducheiro'
	};

	const validate = () => {
		if (!config.role || config.role.length < 3) {
			danger('Cargo inválido');
			return false;
		}

		if (!config.name || config.name.length < 3) {
			danger('Nome inválido');
			return false;
		}

		return true;
	};

	const saveEmployee = async () => {
		try {
			if (!validate()) {
				return;
			}

			await addEmployee(config.name, config.role);
			success('Funcionário adicionada com sucesso');
			closeModal();
		} catch (e: any) {
			danger(e.message);
		}
	};

	const closeModal = () => {
		open = false;
		config.name = '';
		config.role = 'ducheiro';
	};
</script>

<Modal bind:open size="xs" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-6" on:submit={saveEmployee}>
		<h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">
			Adicionando Funcionário
		</h3>

		<div class="flex w-full justify-between items-center gap-4">
			<FloatingLabelInput
				class="w-1/2"
				style="outlined"
				type="text"
				label="Nome"
				bind:value={config.name}
				required
			/>
			<div>
				<Select items={roleOptions} bind:value={config.role} required />
			</div>
		</div>

		<Button type="submit" class="w-full">Salvar</Button>
	</form>
</Modal>
