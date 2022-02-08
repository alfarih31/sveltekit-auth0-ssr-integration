import HTTPClient from '$lib/http-client';

export const rootClient = new HTTPClient({
	baseURL: '',
	basePath: '/api',
	defaultHeaders: {},
});
