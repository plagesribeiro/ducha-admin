<script lang="ts">
	import { Card } from 'flowbite-svelte';
</script>

<div class="flex flex-col w-full h-full items-center justify-center gap-4">
	<Card href="/employees">
		<h5
			class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
		>
			Acessar painel de Funcionários
		</h5>
		<p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">
			Aqui você acessa o painel de funcionários, onde é possível criar e
			deletar os funcionários que trabalham na ducha.
		</p>
	</Card>

	<Card href="/washes">
		<h5
			class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
		>
			Acessar painel de Lavagens
		</h5>
		<p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">
			Aqui você acessa o painel de lavagens, onde é possível criar e deletar
			as lavagens realizadas por cada funcionário.
		</p>
	</Card>
</div>
