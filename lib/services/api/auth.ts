import { authClient } from '$lib/services/api/clients';
import { HTTP_METHOD } from '$lib/modules/http-client';
import { browser } from '$app/env';

export const login = async (username: string, password: string): Promise<App.Session> => {
	const res = await authClient.handleRequest<{ data: App.Session }>(HTTP_METHOD.POST, {
		path: '/login',
		data: {
			username,
			password,
		},
	});

	return res.data.data;
};

export const logout = async () => {
	await authClient.handleRequest<{ role: number }>(HTTP_METHOD.DELETE, {
		path: '/logout',
	});
};

export const getSession = async (): Promise<App.Session> => {
	const res = await authClient.handleRequest<{ data: App.Session }>(HTTP_METHOD.GET, {
		path: '/session',
	});

	return res.data.data;
};
