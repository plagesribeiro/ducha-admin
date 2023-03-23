<script lang="ts">
	import { DateInput } from 'date-picker-svelte';
	import { Button, FloatingLabelInput, Datepicker } from 'flowbite-svelte';

	let date = new Date();
	let employeeId = '';
	let employeeName = '';
	let shift: 'manhã' | 'tarde' | 'noite';
	let size: 'pequeno' | 'medio' | 'grande';
	let payment: string;
	let notes: string;

	const addWash = async () => {
		console.log('tentando adicionar');
	};
</script>

<form
	on:submit={addWash}
	class="w-full h-full p-8  min-w-[300px] max-w-[700px] flex flex-col gap-4 overflow-auto"
>
	<div class="z-[99999]">
		<DateInput closeOnSelection format="dd/MM/yyyy" bind:value={date} />
	</div>

	<Datepicker datepickerFormat="dd/mm/yyyy" />

	<FloatingLabelInput
		style="outlined"
		type="text"
		label="Nome do funcionário"
		bind:value={employeeName}
		required
	/>

	<Button type="submit">Adicionar</Button>
</form>
