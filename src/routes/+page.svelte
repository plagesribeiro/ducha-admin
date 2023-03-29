<script lang="ts">
	import { Card } from 'flowbite-svelte';
</script>

<div
	class="w-full h-full flex flex-col gap-4 max-w-lg text-center items-center justify-center"
>
	<h1 class="text-2xl font-bold flex gap-2">
		Bem vindo ao <div class="text-green-500">Ducha Admin</div>
		!
	</h1>
	<spam>
		Esse projeto foi criado para facilitar o controle e a administração da
		Ducha do posto de gasolina.
	</spam>
	<Card href="/day">
		<h5
			class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
		>
			Acessar a ferramenta
		</h5>
		<p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">
			Aqui você acessa o painel de administrador, somente pessoas autorizadas
			podem acessar.
		</p>
	</Card>
</div>
