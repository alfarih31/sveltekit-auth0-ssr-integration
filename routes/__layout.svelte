<script lang="ts" context="module">
	import routeConfig, { loginPath, homePath } from '$configs/route.config';
	import Vertical from '$components/layouts/Vertical.svelte';
	import Full from '$components/layouts/Full.svelte';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit/types/private';
	import { getSession } from '$lib/services/api/auth';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';

	const getRoutePermission = (pathname: string, auth?: App.Session): boolean => {
		if (pathname === loginPath) {
			return !auth;
		}

		const c = routeConfig[pathname];
		if (!c || !c.permissions) {
			return true;
		}

		if (auth) {
			return c.permissions.length > 0 && c.permissions.includes(auth.role);
		}

		return c.permissions.length === 0;
	};

	const authCheck = async (
		_pathname: string,
		_session?: App.Session
	): Promise<{ status: number; redirect?: string; message?: string }> =>
		new Promise<{ status: number; redirect?: string; message?: string }>(async (resolve) => {
			if (browser) {
				const isAllowed = getRoutePermission(_pathname, _session);

				if (!isAllowed) {
					if (_session && _session.authenticated) {
						if (_pathname === loginPath) {
							goto(homePath, { replaceState: true }).then(() => {
								resolve({
									status: 200,
								});
							});
							return;
						}

						return resolve({
							status: 403,
							message: 'Forbidden',
						});
					}

					if (_pathname !== loginPath) {
						goto(loginPath, { replaceState: true }).then(() => {
							resolve({
								status: 200,
							});
						});
						return;
					}
				}
			}

			return resolve({
				status: 200,
			});
		});

	export async function load({ url: { pathname } }: LoadInput): Promise<LoadOutput> {
		let layout = Full;

		const config = routeConfig[pathname];
		if (config) {
			if (!config.fullLayout && pathname !== '/error/[code]') {
				layout = Vertical;
			}
		}

		const session = await getSession();

		return {
			props: {
				Layout: layout,
				pathname,
				session,
			},
		};
	}
</script>

<script lang="ts">
	import { SvelteComponent } from 'svelte';
	import Error from '$components/Error.svelte';
	import PageLoading from '$components/PageLoading.svelte';

	export let session: App.Session;
	export let pathname: string;
	export let Layout: SvelteComponent;

	let pageStatus: { status: number; message?: string } | void;

	$: {
		authCheck(pathname, session).then((data) => {
			pageStatus = data;
		});
	}
</script>

<svelte:head>
	<title>{import.meta.env.VITE_APP_NAME}</title>
</svelte:head>

<svelte:component this={Layout}>
	{#if pageStatus}
		{#if pageStatus.status === 200}
			<slot />
		{:else}
			<Error status={pageStatus.status} message={pageStatus.message} />
		{/if}
	{:else}
		<PageLoading />
	{/if}
</svelte:component>
