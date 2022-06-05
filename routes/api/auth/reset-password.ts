import type { RequestHandler } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit/types/private';
import { oauthClient } from '$lib/services/clients/rest/auth0';
import { HTTP_METHOD } from '$lib/modules/http-client';
import serverConfigs from '$configs/server';
import { getSessionFromRequest } from '$lib/hooks/auth.hook';
import { logoutPath } from '$configs/client/route.config';
import { updateUserProfile } from '$lib/services/api/by-request/auth0';
import * as yup from 'yup';

export const post: RequestHandler = async ({ request }: RequestEvent) => {
	const body = await request.json();
	const { oldPassword, newPassword } = body;

	try {
		yup
			.string()
			.min(8, '${label} must minimum 8 char length')
			.matches(
				/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
				'${label} must contain one lowercase, one uppercase, one digit, & one special char'
			)
			.required('${label} is required')
			.label('New password')
			.validate(newPassword);
	} catch (err) {
		return {
			status: 400,
			headers: {
				'Content-Type': 'application/json',
			},
			body: err.message,
		};
	}

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

	try {
		await oauthClient.handleRequest<{
			access_token: string;
			refresh_token?: string;
			expires_in: number;
			id_token?: string;
		}>(HTTP_METHOD.POST, {
			path: '/token',
			data: {
				grant_type: 'password',
				username: session.actor.username,
				password: oldPassword,
				client_id: serverConfigs.AUTH0_CLIENT_ID,
				client_secret: serverConfigs.AUTH0_CLIENT_SECRET,
			},
		});
	} catch (err) {
		return {
			status: 401,
			headers: {
				'Content-Type': 'text/html',
			},
			body: 'wrong old password!',
		};
	}

	try {
		await updateUserProfile(request, session.provider + '|' + session.actor.userID, {
			password: newPassword,
		});
		return {
			status: 302,
			headers: {
				Location: '/api/auth/logout',
				'Content-Type': 'text/html',
			},
			body: 'Reset password successfully, please re-login!',
		};
	} catch (err) {
		return {
			status: 401,
			headers: {
				'Content-Type': 'text/html',
			},
			body: err.message,
		};
	}
};
