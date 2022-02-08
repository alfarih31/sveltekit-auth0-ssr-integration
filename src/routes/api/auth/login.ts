import type { RequestEvent } from '@sveltejs/kit/types/hooks';
import type { RequestHandler } from '@sveltejs/kit';
import { USER_ROLE } from '$lib/CONSTANTS';

export const post: RequestHandler = async ({ request }: RequestEvent) => {
	const body = await request.json();
	const username = body['username'];
	const password = body['password'];

	if (username === 'admin' && password === 'admin123') {
		const user = {
			id: 1,
			role: USER_ROLE.PERSONAL,
		};

		const userstring = JSON.stringify(username);
		return {
			status: 200,
			headers: {
				'Set-Cookie': `session=${Buffer.from(userstring).toString(
					'base64'
				)}; Path=/; SameSite=Lax; HttpOnly; Expires=${new Date().toUTCString()}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				code: 0,
				data: user,
			}),
		};
	}

	return {
		status: 403,
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			code: 1001,
			message: 'wrong username/password',
		}),
	};
};
