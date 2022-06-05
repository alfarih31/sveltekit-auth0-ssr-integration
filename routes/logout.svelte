<script lang="ts">
	import { onMount } from 'svelte';
	import { authenticateClient } from '$lib/services/clients/parties/auth0';
	import { goto } from '$app/navigation';
	import { userState } from '$lib/stores';

	onMount(async () => {
		const url = authenticateClient.buildLogoutUrl({
			returnTo: window.location.origin + '/api/auth/logout',
		});
		$userState.profile = {};
		await goto(url);
	});
</script>

<div />
