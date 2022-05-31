import type { RequestHandler } from '@sveltejs/kit';
import { getSessionFromRequest } from '$lib/hooks/auth.hook';

export const get: RequestHandler = async ({ request }) => {
	return {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(await getSessionFromRequest(request)),
	};
};
