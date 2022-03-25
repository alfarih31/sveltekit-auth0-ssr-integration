<script lang="ts" context="module">
	import routeConfig, { loginPath } from '$configs/route.config';
	import Vertical from '$components/layouts/Vertical.svelte';
	import Full from '$components/layouts/Full.svelte';
	import type { LoadInput, LoadOutput } from '@sveltejs/kit/types/private';
	import { getSession } from '$lib/services/api/auth';
	import { browser } from '$app/env';
	import { ERR_FORBIDDEN, ERR_UNAUTHORIZED } from '$lib';

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

	const authCheck = (
		_pathname: string,
		_session?: App.Session
	): { status: number; redirect?: string; error?: Error } => {
		const isAllowed = getRoutePermission(_pathname, _session);

		if (!isAllowed) {
			if (_session && _session.authenticated) {
				if (_pathname === loginPath) {
					return {
						status: 403,
						error: ERR_FORBIDDEN,
					};
				}

				return {
					status: 401,
					error: ERR_UNAUTHORIZED,
				};
			}

			if (_pathname !== loginPath) {
				return {
					status: 302,
					redirect: loginPath,
				};
			}
		}

		return {
			status: 200,
		};
	};
	export async function load({ url: { pathname }, session }: LoadInput): Promise<LoadOutput> {
		let layout = Full;

		const config = routeConfig[pathname];
		if (config) {
			if (!config.fullLayout && pathname !== '/error/[code]') {
				layout = Vertical;
			}
		}

		if (browser) {
			session = await getSession();
		}

		const check = authCheck(pathname, session);

		return {
			...check,
			props: {
				Layout: layout,
				session,
			},
		};
	}
</script>

<script lang="ts">
	import { SvelteComponent } from 'svelte';
	import md5 from 'md5';
	import { session as appSession } from '$app/stores';

	export let Layout: SvelteComponent = Full;
	export let session: App.Session = $appSession;

	appSession.subscribe(() => {});

	$: {
		if (md5(JSON.stringify($appSession)) !== md5(JSON.stringify(session))) {
			console.log('HERE');
			appSession.set(session);
		}
	}
</script>

<svelte:head>
	<title>{import.meta.env.VITE_APP_NAME}</title>
</svelte:head>

<svelte:component this={Layout}>
	<slot />
</svelte:component>
