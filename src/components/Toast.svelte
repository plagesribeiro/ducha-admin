<script context="module" lang="ts">
	import { toast, SvelteToast } from '@zerodevx/svelte-toast';

	export const danger = (message: string): ReturnType<typeof toast.push> =>
		toast.push(message, {
			theme: {
				'--toastBackground': '#dc3545',
				'--toastProgressBackground': '#dc3545',
				'--toastBorderRadius': '6px'
			}
		});

	export const success = (message: string): ReturnType<typeof toast.push> =>
		toast.push(message, {
			theme: {
				'--toastBackground': '#eaeaea',
				'--toastColor': 'black',
				'--toastProgressBackground': '#30305B',
				'--toastBorderRadius': '6px'
			}
		});
</script>

<script lang="ts">
	const errorHandler = (ev: ErrorEvent | unknown) => {
		danger((ev instanceof ErrorEvent && ev.error) || `Um erro inesperado aconteceu.`);
	};
</script>

<svelte:window on:error={errorHandler} on:unhandledrejection={errorHandler} />
<SvelteToast --toastContainerTop="auto" --toastContainerBottom="1.5rem" />
