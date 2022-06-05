import type { RequestEvent } from '@sveltejs/kit';
import { getUsers } from '$lib/services/api/by-request/auth0';
import { getUserManagementTokenFromRequest } from '$lib/hooks/auth.hook';

export const get: ({ request }: RequestEvent) => Promise<{
	headers?: { 'Content-Type': string };
	body?: any;
	status: number;
}> = async ({ request }: RequestEvent) => {
	const token = getUserManagementTokenFromRequest(request);
	if (!token) {
		return { status: 401 };
	}

	const url = new URL(request.url);
	const q = url.searchParams;

	const qPage = q.get('page');
	const qPerPage = q.get('perPage');
	let page = 0;
	let perPage = 5;
	if (qPage) {
		page = parseInt(qPage, 10);
	}

	if (qPerPage) {
		perPage = parseInt(qPerPage, 10);
	}

	const { users, total, start } = await getUsers(request, {
		page,
		perPage,
		includeTotals: true,
		fields: ['user_id', 'nickname', 'email', 'created_at', 'last_login', 'logins_count'],
	});

	return {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
		body: {
			users,
			total,
			start,
		},
	};
};
