<script lang="ts">
	import { danger, success } from 'components/Toast.svelte';
	import { firebaseApp } from 'stores/firebase';
	import {
		getAuth,
		signInWithEmailAndPassword,
		setPersistence,
		browserLocalPersistence,
		browserSessionPersistence
	} from 'firebase/auth';
	import type { UserCredential } from 'firebase/auth';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { FloatingLabelInput, Button, Toggle } from 'flowbite-svelte';

	let emailValue: string;
	let passwordValue: string;
	let remember: boolean = true;

	$: browser &&
		setPersistence(
			getAuth(firebaseApp),
			remember ? browserLocalPersistence : browserSessionPersistence
		);

	const trySignIn = async (
		signInHandler: (
			auth: ReturnType<typeof getAuth>
		) => Promise<UserCredential>
	) => {
		const auth = getAuth(firebaseApp);
		try {
			await signInHandler(auth);
			success('Login realizado com sucesso');

			await goto('/days');
		} catch (err: any) {
			if (err.code === 'auth/user-not-found') {
				danger('E-mail não cadastrado');
			} else if (err.code === 'auth/wrong-password') {
				danger('Senha incorreta');
			} else if (err.code === 'auth/too-many-requests') {
				danger('Muitas tentativas de login, tente novamente mais tarde');
			} else if (err.code === 'auth/invalid-email') {
				danger('E-mail inválido');
			} else {
				danger('Erro ao realizar login');
			}
		}
	};

	const onSubmitLoginForm = async () => {
		await trySignIn((auth) =>
			signInWithEmailAndPassword(auth, emailValue, passwordValue)
		);
	};
</script>

<svelte:head>
	<title>P&S - Entrar</title>
</svelte:head>

<form
	class="flex flex-col items-center gap-3 overflow-auto"
	on:submit|preventDefault={onSubmitLoginForm}
>
	<h1 class="font-bold text-2xl w-full">Entrar</h1>

	<div class="w-full">
		<FloatingLabelInput
			style="outlined"
			type="text"
			label="Email"
			bind:value={emailValue}
			required
		/>
	</div>

	<div class="w-full">
		<FloatingLabelInput
			style="outlined"
			type="password"
			label="Senha"
			bind:value={passwordValue}
			required
		/>
	</div>

	<div class="flex justify-between items-center w-full text-sm mt-6 mb-6">
		<label
			for="remember"
			class="flex gap-2 items-center justify-start text-gray-800 dark:text-gray-200"
		>
			<Toggle bind:checked={remember} />
			Lembrar de mim
		</label>
	</div>

	<Button type="submit" class="w-full" color="green">Entrar</Button>
</form>
