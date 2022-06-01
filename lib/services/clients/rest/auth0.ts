import HTTPClient from '$lib/modules/http-client';
import serverConfigs from '$configs/server';

export const apiClient = new HTTPClient({
	baseURL: `https://${serverConfigs.AUTH0_DOMAIN}`,
	basePath: '/api/v2',
	defaultHeaders: {
		'content-type': 'application/json',
	},
});

export const oauthClient = new HTTPClient({
	baseURL: `https://${serverConfigs.AUTH0_DOMAIN}`,
	basePath: '/oauth',
	defaultHeaders: {
		'content-type': 'application/json',
	},
});

export const baseClient = new HTTPClient({
	baseURL: `https://${serverConfigs.AUTH0_DOMAIN}`,
	basePath: '/',
	defaultHeaders: {
		'content-type': 'application/json',
	},
});
