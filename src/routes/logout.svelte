<script lang="ts">
	import Auth from '$lib/adaptors/auth';
	import { session } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { homePath } from '$configs/route.config';

	let s: App.Session;
	session.subscribe((_s) => {
		s = _s;
	});

	onMount(async () => {
		if (s.authenticated) {
			await Auth.logout(session);
			return await goto('/login', { replaceState: true });
		}

		return await goto(homePath);
	});
</script>
