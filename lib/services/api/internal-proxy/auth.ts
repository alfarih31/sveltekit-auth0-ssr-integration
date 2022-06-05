import internalProxyClient from '$lib/services/clients/rest/internal-proxy';
import { HTTP_METHOD } from '$lib/modules/http-client';

export const login = async (email: string, password: string): Promise<App.Session> => {
	const res = await internalProxyClient.handleRequest<{ data: App.Session }>(HTTP_METHOD.POST, {
		path: '/auth/login',
		data: {
			email,
			password,
		},
	});

	return res.data.data;
};

export const register = async (data: KeyValue): Promise<User.Profile> => {
	const res = await internalProxyClient.handleRequest<User.Profile>(HTTP_METHOD.POST, {
		path: '/auth/register',
		data,
	});

	return res.data;
};
