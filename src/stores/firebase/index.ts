import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { readable } from 'svelte/store';
import { browser } from '$app/environment';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_APIKEY,
	authDomain: import.meta.env.VITE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_APP_ID
};

export const firebaseApp = getApps()?.[0] || initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = browser && getAuth(firebaseApp);

export const authentication = readable<
	ReturnType<typeof getAuth>['currentUser'] | undefined | false
>(auth && auth?.currentUser ? auth.currentUser : undefined, (set) => {
	if (!auth) {
		return undefined;
	}

	set(auth.currentUser ?? undefined);
	return onAuthStateChanged(auth, (user) => set(user ?? false));
});
