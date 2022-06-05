import type { RequestHandler } from '@sveltejs/kit';
import { getUserInfo, updateUserProfile } from '$lib/services/api/by-request/auth0';
import { getSessionFromRequest, getUserTokenFromRequest } from '$lib/hooks/auth.hook';

export const get: RequestHandler = async ({ request }) => {
	const userToken = getUserTokenFromRequest(request);
	if (!userToken) {
		return {
			status: 401,
		};
	}

	return {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(await getUserInfo(request), (key, value) => {
			if (typeof value === 'bigint') {
				return Number(value);
			}

			return value;
		}),
	};
};

export const patch: RequestHandler = async ({ request }) => {
	const session = await getSessionFromRequest(request);
	if (!session.actor || !session.actor.username) {
		return {
			status: 401,
			headers: {
				'Content-Type': 'text/html',
			},
			body: 'session not valid!',
		};
	}

	const data = await request.json();

	try {
		const res = await updateUserProfile(
			request,
			session.provider + '|' + session.actor.userID,
			data
		);

		return {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
			body: {
				id: session.actor.userID,
				name: res.name,
				nickname: res.nickname,
				email: res.email,
				email_verified: res.email_verified,
				provider: session.provider,
				picture: res.picture,
			},
		};
	} catch (err) {
		return {
			status: 401,
			headers: {
				'Content-Type': 'application/json',
			},
			body: err.message,
		};
	}
};
