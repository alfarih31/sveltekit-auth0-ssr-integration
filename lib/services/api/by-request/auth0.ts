import {
	getSessionFromRequest,
	getUserManagementTokenFromRequest,
	getUserTokenFromRequest,
} from '$lib/hooks/auth.hook';
import { apiClient, baseClient } from '$lib/services/clients/rest/auth0';
import { HTTP_METHOD } from '$lib/modules/http-client';
import type { Auth0UserProfile } from 'auth0-js';
import { DateTime } from 'luxon';

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
			page: opts.page || 1,
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
