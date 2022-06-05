import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { COOKIES_KEY } from '$lib/CONSTANTS';
import cookie from 'cookie';
import { encryptString } from '$lib/modules/crypto';
import DateUtils from '$lib/modules/date-utils';
import * as yup from 'yup';
import { oauthClient } from '$lib/services/clients/rest/auth0';
import { HTTP_METHOD } from '$lib/modules/http-client';
import serverConfigs from '$configs/server';
import { getUserManagementToken } from '$lib/services/api/by-request/auth0';

export const post: RequestHandler = async ({ request }: RequestEvent) => {
	const body = await request.json();
	const loginSchema = yup.object({
		email: yup
			.string()
			.email('Not a valid email address')
			.required('${label} is required')
			.label('Email'),
		password: yup
			.string()
			.min(8, '${label} must minimum 8 char length')
			.matches(
				/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
				'${label} must contain one lowercase, one uppercase, one digit, & one special char'
			)
			.required('${label} is required')
			.label('Password'),
	});

	let email = '';
	let password = '';
	try {
		const { email: _email, password: _password } = await loginSchema.validate(body);
		email = _email;
		password = _password;
	} catch (err) {
		return {
			status: 400,
			headers: {
				'Content-Type': 'application/json',
			},
			body: err.message,
		};
	}

	try {
		let { data } = await oauthClient.handleRequest<{
			access_token: string;
			refresh_token?: string;
			expires_in: number;
			id_token?: string;
		}>(HTTP_METHOD.POST, {
			path: '/token',
			data: {
				grant_type: 'password',
				username: email,
				password: password,
				client_id: serverConfigs.AUTH0_CLIENT_ID,
				client_secret: serverConfigs.AUTH0_CLIENT_SECRET,
				scope: 'offline_access openid email profile',
			},
		});

		const now = new Date();

		const cookies = [
			cookie.serialize(COOKIES_KEY.USER_TOKEN, data.access_token, {
				expires: DateUtils.addSecond(now, data.expires_in),
				httpOnly: true,
				sameSite: 'lax',
				encode: encryptString,
				path: '/',
			}),
			cookie.serialize(COOKIES_KEY.USER_REFRESH_TOKEN, data.refresh_token, {
				expires: DateUtils.addSecond(now, data.expires_in),
				httpOnly: true,
				sameSite: 'lax',
				encode: encryptString,
				path: '/',
			}),
			cookie.serialize(COOKIES_KEY.USER_ID_TOKEN, data.id_token, {
				expires: DateUtils.addSecond(now, data.expires_in),
				httpOnly: true,
				sameSite: 'lax',
				encode: encryptString,
				path: '/',
			}),
		];

		data = await getUserManagementToken(request);

		cookies.push(
			cookie.serialize(COOKIES_KEY.USER_MANAGEMENT_TOKEN, data.access_token, {
				expires: DateUtils.addSecond(now, data.expires_in),
				httpOnly: true,
				sameSite: 'lax',
				encode: encryptString,
				path: '/',
			})
		);

		return {
			status: 204,
			headers: {
				'Set-Cookie': cookies,
			},
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
