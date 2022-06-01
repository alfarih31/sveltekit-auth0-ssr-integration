import type { RequestEvent } from '@sveltejs/kit/types/private';
import serverConfigs from '$configs/server';
import cookie from 'cookie';
import { COOKIES_KEY } from '$lib/CONSTANTS';
import DateUtils from '$lib/modules/date-utils';
import { encryptString } from '$lib/modules/crypto';
import { homePath } from '$configs/client/route.config';
import { oauthClient } from '$lib/services/clients/rest/auth0';
import { HTTP_METHOD } from '$lib/modules/http-client';

export const get: ({
	request,
}: RequestEvent) => Promise<{ headers: { 'Set-Cookie': string[] }; status: number }> = async ({
	request,
}: RequestEvent) => {
	const url = new URL(request.url);
	let { data } = await oauthClient.handleRequest<{
		access_token: string;
		refresh_token?: string;
		expires_in: number;
		id_token?: string;
	}>(HTTP_METHOD.POST, {
		path: '/token',
		data: {
			grant_type: 'authorization_code',
			client_id: serverConfigs.AUTH0_CLIENT_ID,
			client_secret: serverConfigs.AUTH0_CLIENT_SECRET,
			code: url.searchParams.get('code'),
			redirect_uri: url.origin + url.pathname,
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

	data = (
		await oauthClient.handleRequest<{
			access_token: string;
			expires_in: number;
		}>(HTTP_METHOD.POST, {
			path: '/token',
			data: {
				grant_type: 'client_credentials',
				client_id: serverConfigs.AUTH0_CLIENT_ID,
				client_secret: serverConfigs.AUTH0_CLIENT_SECRET,
				scope: 'read:users read:user_idp_tokens read:stats update:users',
				audience: `https://${serverConfigs.AUTH0_DOMAIN}/api/v2/`,
			},
		})
	).data;

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
		status: 302,
		headers: {
			Location: homePath,
			'Set-Cookie': cookies,
		},
	};
};
