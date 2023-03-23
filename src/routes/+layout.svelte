<script>
	import { browser } from '$app/environment';
	import Toast from 'components/Toast.svelte';
	import '../app.css';

	$: if (browser) {
		if (
			localStorage.getItem('theme') === 'dark' ||
			(!('theme' in localStorage) &&
				window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}
</script>

<svelte:head>
	<title>P&S</title>
</svelte:head>

<div id="theme-container">
	<div id="app-content">
		<div
			class="flex flex-col w-screen h-screen overflow-clip items-center justify-start bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100"
		>
			<Toast />
			<slot />
		</div>
	</div>
</div>
