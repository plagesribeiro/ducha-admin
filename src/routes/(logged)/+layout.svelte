<script lang="ts">
	import { browser } from '$app/environment';
	import { authentication } from 'stores/firebase';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import NavBar from 'components/NavBar.svelte';

	$: if (browser && $authentication !== undefined) {
		if (!$authentication && !$page.url.pathname.startsWith('/auth')) {
			goto('/auth/logout');
		}
	}
</script>

<div class="w-full h-full flex flex-col overflow-clip">
	<NavBar />
	<div class="flex flex-col h-full w-full items-center overflow-clip">
		<slot />
	</div>
</div>
