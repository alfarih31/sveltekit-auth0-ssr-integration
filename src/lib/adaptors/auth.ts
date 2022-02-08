import routeConfig from '$configs/route.config';
import { rootClient } from './http';
import { HTTP_METHOD } from '$lib/http-client';
import type { Writable } from 'svelte/store';

export default class Auth {
	static getPermission = (path: string, session: App.Session): boolean => {
		const c = routeConfig[path];

		return !c || c.permissions.length === 0 || c.permissions.includes(session.user.role);
	};

	static login = async (username: string, password: string, session: Writable<App.Session>) => {
		const res = await rootClient.handleRequest<{ data: App.User }>(HTTP_METHOD.POST, {
			path: '/auth/login',
			data: {
				username,
				password,
			},
		});

		session.set({
			authenticated: true,
			user: res.data.data,
		});
	};

	static logout = async (session: Writable<App.Session>) => {
		await rootClient.handleRequest(HTTP_METHOD.POST, { path: '/auth/logout' });
		session.set({ authenticated: false, user: undefined });
	};
}
