import HTTPClient from '$lib/modules/http-client';
import { browser } from '$app/env';

const internalProxyClient = new HTTPClient({
	baseURL: browser ? '' : process.env.BASE_URL,
	basePath: '/api',
	defaultHeaders: {
		'Content-Type': 'application/json',
	},
});

export default internalProxyClient;
