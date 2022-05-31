import type { RequestHandler } from '@sveltejs/kit';
import { COOKIES_KEY, SUBJECT, AUDIENCE } from '$lib/CONSTANTS';
import cookie from 'cookie';
import { encryptString } from '$lib/modules/crypto';
import type { RequestEvent } from '@sveltejs/kit/types/private';
import Jwt from '$lib/modules/jwt';
import { generateString } from '$lib/modules/id-generator';
import DateUtils from '$lib/modules/date-utils';

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

	if (username !== 'user') {
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

	const payload: App.Session = { actor: { userID: 1, subjectID: SUBJECT.ADMIN } };

	const now = new Date();
	const { token, expiredAt } = Jwt.sign(
		{
			subjectID: SUBJECT.ADMIN,
			issuer: 'test',
			audience: AUDIENCE.ACCESS_CMS,
			sessionID: generateString(),
			createdAt: now,
			lifetime: 300,
		},
		'TESTKEY'
	);

	return {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
			'Set-Cookie': [
				cookie.serialize(COOKIES_KEY.USER_TOKEN, token, {
					expires: DateUtils.fromEpoch(expiredAt),
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
