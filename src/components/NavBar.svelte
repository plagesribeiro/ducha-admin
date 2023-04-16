<script>
	import DarkMode from 'components/DarkMode.svelte';
	import {
		Navbar,
		NavBrand,
		NavHamburger,
		NavUl,
		NavLi
	} from 'flowbite-svelte';
	import { isAdmin } from 'stores/firebase';
</script>

<div class="w-full border-b-2 border-gray-200 dark:border-gray-700">
	<Navbar let:hidden let:toggle>
		<NavBrand href="/">
			<span
				class="self-center whitespace-nowrap text-2xl font-bold dark:text-white text-green-500"
				>Ducha Admin</span
			>
		</NavBrand>
		<NavHamburger on:click={toggle} />
		<NavUl {hidden}>
			{#if $isAdmin}
				<NavLi href="/admin">Admin</NavLi>
				<NavLi href="/admin/employees">Funcionários</NavLi>
				<NavLi href="/days">Dias</NavLi>
			{/if}

			<NavLi href="/auth/logout">Sair</NavLi>
		</NavUl>
	</Navbar>
</div>
