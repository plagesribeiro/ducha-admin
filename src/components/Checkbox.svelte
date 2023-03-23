<script lang="ts">
	import { Check } from 'svelte-hero-icons';

	export let isChecked = true;
</script>

<input class="w-5 h-5 rounded" type="checkbox" bind:checked={isChecked} />
