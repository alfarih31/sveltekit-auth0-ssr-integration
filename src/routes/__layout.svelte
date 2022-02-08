<script lang="ts" context="module">
	import { loadLayout } from '../hooks';
	import Auth from '$lib/adaptors/auth';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';
	import type { Either } from '@sveltejs/kit/types/helper';
	import type { Fallthrough } from '@sveltejs/kit/types/endpoint';
	import { loginPath } from '$configs/route.config';

	export async function load({
		url: { pathname },
		session,
	}: LoadInput): Promise<Either<Fallthrough, LoadOutput>> {
		const isAllowed = Auth.getPermission(pathname, session);
		if (!isAllowed) {
			return {
				status: 302,
				redirect: loginPath,
			};
		}

		return {
			props: {
				Layout: loadLayout(pathname),
				session,
				pathname,
			},
		};
	}
</script>

<script lang="ts">
	import { SvelteComponent } from 'svelte';

	export let Layout: SvelteComponent;
</script>

<svelte:head>
	<title>{import.meta.env.VITE_APP_NAME}</title>
</svelte:head>

<svelte:component this={Layout}>
	<slot />
</svelte:component>
