<script lang="ts">
	import { Icon, type IconSource } from 'svelte-hero-icons';
	export let variants: 'primary' = 'primary';
	export let type: 'button' | 'submit' | 'reset' | null | undefined = 'button';
	export let icon: IconSource | undefined = undefined;
	export let smallPadding = false;
	export let ghost = false;
	export let disabled = false;
</script>

<button
	on:click
	class:primary={variants === 'primary'}
	class:ghost
	{disabled}
	class="{!smallPadding ? 'py-3 px-4' : 'py-2 px-3'} {disabled
		? 'disabled'
		: ''} px-4 max-w-sm rounded font-semibold text-gray-100  text-sm w-full  transition-colors  focus:ring-2 ring-white"
	{type}
>
	<div class="flex items-center justify-center gap-2">
		<slot />
		{#if icon}
			<Icon src={icon} size="29" class="text-gray-100" />
		{/if}
	</div>
</button>

<style lang="scss">
	.primary {
		@apply bg-green-500 hover:bg-green-700;
	}

	.disabled {
		@apply hover:bg-green-500 cursor-not-allowed;
	}

	.ghost {
		@apply bg-transparent border-2 border-green-300 text-green-500 hover:bg-transparent focus:ring-0  hover:border-green-700  transition-all duration-200;
	}
</style>
