<script>
	import DarkMode from 'components/DarkMode.svelte';
	import {
		Navbar,
		NavBrand,
		NavHamburger,
		NavUl,
		NavLi
	} from 'flowbite-svelte';
</script>

<div class="w-full border-b-2 border-gray-200 dark:border-gray-700">
	<Navbar let:hidden let:toggle>
		<NavBrand href="/admin">
			<span
				class="self-center whitespace-nowrap text-2xl font-bold dark:text-white text-green-500"
				>Ducha Admin</span
			>
		</NavBrand>
		<NavHamburger on:click={toggle} />
		<NavUl {hidden}>
			<NavLi href="/employees">Funcionários</NavLi>
			<NavLi href="/washes">Lavagens</NavLi>

			<NavLi href="/auth/logout">Sair</NavLi>
		</NavUl>
	</Navbar>
</div>
