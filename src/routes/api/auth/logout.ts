import type { RequestEvent } from '@sveltejs/kit/types/hooks';
import type { RequestHandler } from '@sveltejs/kit';
import { USER_ROLE } from '$lib/CONSTANTS';

export const post: RequestHandler = async ({}: RequestEvent) => {
	return {
		status: 200,
		headers: {
			'Set-Cookie': `session=; Path=/; SameSite=Lax; HttpOnly; Expires=${new Date().toUTCString()}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			code: 0,
			message: 'logged-out',
		}),
	};
};
