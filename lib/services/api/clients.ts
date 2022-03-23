import HTTPClient from '$lib/modules/http-client';
import { browser } from '$app/env';

export const authClient = new HTTPClient({
	baseURL: browser ? '' : process.env.BASE_URL,
	basePath: '/api/auth',
	defaultHeaders: {},
});
