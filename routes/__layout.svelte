<script lang="ts" context="module">
	import routeConfig from '$configs/client/route.config';
	import Vertical from '$components/layouts/Vertical.svelte';
	import Full from '$components/layouts/Full.svelte';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit/types/private';
	import { authCheck } from '$lib/hooks/auth.client.hook';

	export async function load({ url: { pathname }, fetch }: LoadInput): Promise<LoadOutput> {
		// Session checking
		const res = await fetch('/api/auth/session');
		const session = await res.json();
		const check = authCheck(pathname, session);

		// Layout checking
		let layout = Full;
		const config = routeConfig[pathname];
		if (config) {
			if (!config.fullLayout && pathname !== '/error/[code]') {
				layout = Vertical;
			}
		}

		return {
			...check,
			props: {
				Layout: layout,
			},
		};
	}
</script>

<script lang="ts">
	import { SvelteComponent } from 'svelte';

	export let Layout: SvelteComponent = Full;
</script>

<svelte:head>
	<title>{import.meta.env.VITE_APP_NAME}</title>
</svelte:head>

<svelte:component this={Layout}>
	<slot />
</svelte:component>

<style lang="scss" global>
	@import 'static/scss/core/index';
</style>
