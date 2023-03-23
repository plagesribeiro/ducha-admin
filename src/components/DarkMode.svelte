<script lang="ts">
	import { onMount } from 'svelte';
	import { Icon, Moon, Sun } from 'svelte-hero-icons';
	// indicate if we're in dark mode or not
	let dark: boolean;
	// hide the control until we've decided what the intial mode is
	let hidden = true;
	onMount(() => {
		// use the existence of the dark class on the html element for the initial value
		dark = document.documentElement.classList.contains('dark');
		// show UI controls
		hidden = false;
		// listen for changes so we auto-adjust based on system settings
		const matcher = window.matchMedia('(prefers-color-scheme: dark)');
		matcher.addEventListener('change', handleChange);
		return () => matcher.removeEventListener('change', handleChange);
	});
	function handleChange({ matches: dark }: MediaQueryListEvent) {
		// only set if we haven't overridden the theme
		if (!localStorage.theme) {
			setMode(dark);
		}
	}
	function toggleTheme() {
		setMode(!dark);
	}
	function setMode(value: boolean) {
		dark = value;
		if (dark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
		localStorage.theme = dark ? 'dark' : 'light';
		if (
			window.matchMedia(`(prefers-color-scheme: ${localStorage.theme})`)
				.matches
		) {
			localStorage.removeItem('theme');
		}
	}
</script>

<button
	on:click={toggleTheme}
	class="flex w-full gap-1 items-center justify-start"
>
	<div class:hidden={!dark} class="flex items-center justify-start gap-2">
		<div class="h-5 w-5"><Icon src={Sun} solid /></div>
	</div>

	<div class:hidden={dark} class="flex items-center justify-start gap-2">
		<div class="h-5 w-5"><Icon src={Moon} solid /></div>
	</div>

	<slot />
</button>
