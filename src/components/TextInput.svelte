<script lang="ts">
	import { Icon, InformationCircle } from 'svelte-hero-icons';
	import type { IconSource } from 'svelte-hero-icons';
	import Popover from 'svelte-easy-popover/dist/ts/Popover.svelte';
	export let placeholder = 'placeholder';
	export let value = '';
	export let required = false;
	export let help = '';
	export let label = '';
	export let icon: IconSource | undefined = undefined;

	let infoIconEl: HTMLSpanElement;
</script>

{#if help}
	<Popover
		triggerEvents={['hover', 'focus']}
		referenceElement={infoIconEl}
		placement="auto"
		spaceAway={10}
	>
		<div
			class="inline-block p-2 bg-gray-600 text-gray-200 rounded-lg max-w-[300px] text-xs"
		>
			{help}
		</div>
	</Popover>
{/if}
<div class="flex w-full items-start gap-1 flex-col">
	<spam class="label">
		{label}
		{#if help}
			<span class="h-5 block" bind:this={infoIconEl}>
				<Icon src={InformationCircle} />
			</span>
		{/if}
	</spam>
	<div class="input bg-gray-300">
		{#if icon}
			<Icon src={icon} size="23" class="text-gray-400 " />
		{/if}

		<input
			{...$$restProps}
			class="field text-gray-900 placeholder:text-gray-400 "
			bind:value
			{placeholder}
			{required}
		/>
	</div>
</div>

<style lang="scss">
	.label {
		@apply text-sm font-semibold flex items-center gap-1;
	}
	.input {
		@apply flex w-full items-center gap-3 py-4 px-3 rounded  focus-within:ring-2 ring-green-300;

		.field {
			@apply bg-transparent border-transparent border-0 focus:outline-none w-full h-full text-xs p-0;
		}
	}
</style>
