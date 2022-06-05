import {
	getSessionFromRequest,
	getUserManagementTokenFromRequest,
	getUserTokenFromRequest,
} from '$lib/hooks/auth.hook';
import { apiClient, baseClient, oauthClient } from '$lib/services/clients/rest/auth0';
import { HTTP_METHOD } from '$lib/modules/http-client';
import type { Auth0UserProfile } from 'auth0-js';
import { DateTime } from 'luxon';
import serverConfigs from '$configs/server';
import APPError from '$lib/modules/app-error';

export const getUserInfo = async (req: Request): Promise<Partial<User.Profile>> => {
	const userToken = getUserTokenFromRequest(req);
	if (!userToken) {
		return {};
	}

	const { data } = await baseClient.handleRequest<Auth0UserProfile>(HTTP_METHOD.GET, {
		path: '/userinfo',
		config: {
			headers: {
				authorization: `Bearer ${userToken}`,
			},
		},
	});

	const [provider, id] = data.sub.split('|');
	return {
		id,
		name: data.name,
		nickname: data.nickname,
		email: data.email,
		email_verified: data.email_verified,
		provider,
		picture: data.picture,
	};
};

type GetUserOpts = {
	page: number;
	perPage: number;
	includeTotals: boolean;
	fields: string[];
};
type GetUserRes<T> = {
	start: number;
	limit: number;
	length: number;
	users: T[];
	total?: number;
};

export const getUsers = async <T>(
	req: Request,
	opts: Partial<GetUserOpts>
): Promise<GetUserRes<T>> => {
	const token = getUserManagementTokenFromRequest(req);
	if (!token) {
		return { start: 0, limit: 0, length: 0, users: [] };
	}

	const { data } = await apiClient.handleRequest<GetUserRes<T>>(HTTP_METHOD.GET, {
		path: '/users',
		data: {
			page: opts.page || 0,
			per_page: opts.perPage || 10,
			include_totals: opts.includeTotals || false,
			fields: opts.fields ? opts.fields.join(',') : '',
		},
		config: {
			headers: {
				authorization: `Bearer ${token}`,
			},
		},
	});

	return data;
};

type GetDailyStatsRes = {
	date: string;
	logins: number;
	signups: number;
	leaked_passwords: number;
	updated_at: string;
	created_at: string;
};
export const getDailyStats = async (
	req: Request,
	opts: { from?: Date; to?: Date }
): Promise<GetDailyStatsRes[]> => {
	const token = getUserManagementTokenFromRequest(req);
	if (!token) {
		return [];
	}

	const q: { from?: string; to?: string } = {};

	if (opts.from) {
		q.from = DateTime.fromISO(opts.from.toISOString()).toFormat('yyyyLLdd');
	}

	if (opts.to) {
		q.to = DateTime.fromISO(opts.to.toISOString()).toFormat('yyyyLLdd');
	}

	const { data } = await apiClient.handleRequest<GetDailyStatsRes[]>(HTTP_METHOD.GET, {
		path: '/stats/daily',
		data: q,
		config: {
			headers: {
				authorization: `Bearer ${token}`,
			},
		},
	});

	return data;
};

export const resendVerificationEmail = async (req: Request) => {
	const token = getUserManagementTokenFromRequest(req);
	if (!token) {
		return;
	}

	const session = await getSessionFromRequest(req);

	await apiClient.handleRequest(HTTP_METHOD.POST, {
		path: '/jobs/verification-email',
		data: {
			user_id: session.provider + '|' + session.actor.userID,
			client_id: serverConfigs.AUTH0_CLIENT_ID,
			identity: {
				user_id: session.actor.userID,
				provider: session.provider,
			},
		},
		config: {
			headers: {
				authorization: `Bearer ${token}`,
			},
		},
	});
};

export const getUserManagementToken = async (
	req: Request
): Promise<{ access_token: string; expires_in: number }> => {
	const { data } = await oauthClient.handleRequest<{
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
			nonce: 'nonce',
		},
	});

	return data;
};

export const updateUserProfile = async (
	req: Request,
	id: string,
	profile: Partial<
		Omit<
			Auth0UserProfile,
			| 'user_id'
			| 'clientID'
			| 'gender'
			| 'locale'
			| 'identities'
			| 'created_at'
			| 'updated_at'
			| 'sub'
			| 'user_metadata'
			| 'app_metadata'
		> & { password: string }
	>
): Promise<Auth0UserProfile> => {
	const token = getUserManagementTokenFromRequest(req);
	if (!token) {
		throw new APPError('APP_ERROR', { message: 'no token to perform this action' });
	}

	const { data } = await apiClient.handleRequest<Auth0UserProfile>(HTTP_METHOD.PATCH, {
		path: `/users/${id}`,
		data: profile,
		config: {
			headers: {
				authorization: `Bearer ${token}`,
			},
		},
	});

	return data;
};
