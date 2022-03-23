<script lang="ts">
	import sessionState from '$lib/stores/states/session.state';
	import { browser } from '$app/env';
	import { getRoutePermission } from '$lib/hooks/auth.hook';
	import { loginPath } from '$configs/route.config';
	import { invalidate } from '$app/navigation';

	export let pathname: string;

	const authCheck = async (session: App.Session) => {
		if (browser) {
			const isAllowed = getRoutePermission(pathname, session);
			if (!isAllowed) {
				if (session && session.authenticated) {
					if (pathname === loginPath) {
						return await invalidate(pathname);
					}
				}

				// Handle for unauthenticated user
				if (pathname !== loginPath) {
					return await invalidate(pathname);
				}
			}
		}
	};

	console.log($sessionState);

	sessionState.subscribe((s) => authCheck(s));
</script>

<div>
	<slot />
</div>
