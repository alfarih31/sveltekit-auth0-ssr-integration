import type { RequestEvent } from '@sveltejs/kit';

import { resendVerificationEmail } from '$lib/services/api/by-request/auth0';

export const get: ({ request }: RequestEvent) => Promise<{ status: number }> = async ({
	request,
}: RequestEvent) => {
	await resendVerificationEmail(request);
	return {
		status: 204,
	};
};
