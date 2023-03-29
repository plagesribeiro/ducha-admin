<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { Card, Button, Label, Input, Checkbox } from 'flowbite-svelte';
	import { authentication } from 'stores/firebase';

	let users = [];

	$: if (browser && $authentication !== undefined) {
		console.log('entrou');
		if ($authentication && $authentication.email?.endsWith('@asd.asd')) {
			console.log('aqui');
			const email = $authentication.email;
		} else {
			console.log('vazour');
			goto('/auth/logout');
		}
	}
</script>

<Card>
	<form class="flex flex-col space-y-6" action="/">
		<h1 class="text-xl font-semibold">Bombas</h1>

		<Label class="space-y-2">
			<span>Your password</span>
			<Input type="password" name="password" placeholder="•••••" required />
		</Label>
		<div class="flex items-start">
			<Checkbox>Remember me</Checkbox>
			<a
				href="/"
				class="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
				>Lost password?</a
			>
		</div>
		<Button type="submit" class="w-full">Login to your account</Button>
		<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
			Not registered? <a
				href="/"
				class="text-blue-700 hover:underline dark:text-blue-500"
				>Create account</a
			>
		</div>
	</form>
</Card>
