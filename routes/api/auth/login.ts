import type { RequestHandler } from '@sveltejs/kit';
import { COOKIES_KEY, USER_ROLE } from '$lib/CONSTANTS';
import cookie from 'cookie';
import { encryptString } from '$lib/modules/crypto';
import type { RequestEvent } from '@sveltejs/kit/types/private';

export const post: RequestHandler = async ({ request }: RequestEvent) => {
	const body = await request.json();
	const username = body['username'];
	const password = body['password'];

	if (password !== 'password123') {
		return {
			status: 401,
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				message: 'wrong password',
			}),
		};
	}

	let role = USER_ROLE.PUBLIC;
	switch (username) {
		case 'admin':
			role = USER_ROLE.ADMIN;
			break;
		case 'user':
			role = USER_ROLE.PERSONAL;
			break;
		default:
			return {
				status: 401,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					message: 'wrong username',
				}),
			};
	}

	const payload: App.Session = { authenticated: true, role, userID: 1 };

	return {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
			'Set-Cookie': [
				cookie.serialize(
					COOKIES_KEY.USER_TOKEN,
					Buffer.from(username + password).toString('base64'),
					{
						expires: new Date(new Date().getTime() + 300000),
						httpOnly: true,
						sameSite: 'lax',
						encode: encryptString,
						path: '/',
					}
				),
				cookie.serialize(COOKIES_KEY.SESSION, JSON.stringify(payload), {
					expires: new Date(new Date().getTime() + 300000),
					httpOnly: true,
					sameSite: 'lax',
					encode: encryptString,
					path: '/',
				}),
			],
		},
		body: JSON.stringify({
			data: payload,
		}),
	};
};
