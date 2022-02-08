import type { GetSession, RequestEvent } from '@sveltejs/kit';
import type { MaybePromise } from '@sveltejs/kit/types/helper';
import routeConfig from '$configs/route.config';

import FullLayout from './layouts/Full.svelte';
import VerticalLayout from './layouts/Vertical.svelte';
import type { SvelteComponentDev } from 'svelte/internal';

export const loadLayout = (pathname: string): typeof SvelteComponentDev => {
	const c = routeConfig[pathname];

	if (c) {
		if (c.fullLayout) {
			return FullLayout;
		}
	}

	return VerticalLayout;
};

export const getSession: GetSession = (e: RequestEvent): MaybePromise<App.Session> => {
	return {
		authenticated: e.locals.authenticated === true,
		user: e.locals.user || { id: 0, role: 0 },
	};
};
