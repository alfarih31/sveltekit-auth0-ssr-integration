import type { RequestEvent } from '@sveltejs/kit';
import { DateTime } from 'luxon';

import { getDailyStats, getUsers } from '$lib/services/api/by-request/auth0';
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

	const now = DateTime.now();
	const { total: totalSignedUp } = await getUsers(request, { includeTotals: true });
	const dailyStats = await getDailyStats(request, {
		from: now.minus({ day: 7 }).toJSDate(),
		to: now.toJSDate(),
	});

	const weeklyLogins = Math.ceil(
		dailyStats.reduce((accum, curr) => {
			return accum + curr.logins;
		}, 0) / dailyStats.length
	);

	return {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
		body: {
			totalSignedUp,
			logins: dailyStats[0].logins,
			weeklyLogins,
		},
	};
};
