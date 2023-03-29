<script>
	import Toast from 'components/Toast.svelte';
	import '../app.css';
</script>

<svelte:head>
	<title>P&S</title>
</svelte:head>

<div id="theme-container">
	<div id="app-content">
		<div
			class="w-screen h-screen flex flex-col items-center justify-center overflow-clip min-w-[350px] bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100"
		>
			<Toast />
			<slot />
		</div>
	</div>
</div>
