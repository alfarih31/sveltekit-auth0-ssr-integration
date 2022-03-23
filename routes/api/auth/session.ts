import type { RequestEvent } from '@sveltejs/kit/types/private';
import type { RequestHandler } from '@sveltejs/kit';
import { getSessionFromRequest } from '$lib/hooks/auth.hook';

export const get: RequestHandler = async ({ request }: RequestEvent) => {
	return {
		status: 200,
		headers: {
			'Content-Tye': 'application/json',
		},
		body: JSON.stringify({
			code: 0,
			message: 'OK',
			data: getSessionFromRequest(request),
		}),
	};
};
