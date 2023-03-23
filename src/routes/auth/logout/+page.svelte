<script lang="ts">
	import { firebaseApp } from 'stores/firebase';
	import { goto } from '$app/navigation';

	import { getAuth, signOut } from 'firebase/auth';
	import { onMount } from 'svelte';

	onMount(async () => {
		await signOut(getAuth(firebaseApp));
		await goto('/auth/login');
	});
</script>
