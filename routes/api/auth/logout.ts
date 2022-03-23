import type { RequestHandler } from '@sveltejs/kit';
import { COOKIES_KEY } from '$lib/CONSTANTS';
import cookie from 'cookie';

export const del: RequestHandler = async () => {
	return {
		status: 200,
		headers: {
			'Set-Cookie': [
				cookie.serialize(COOKIES_KEY.SESSION, '', { expires: new Date(0), path: '/' }),
				cookie.serialize(COOKIES_KEY.USER_TOKEN, '', { expires: new Date(0), path: '/' }),
			],
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			code: 0,
			message: 'logged-out',
		}),
	};
};
