import type { Handle } from '@sveltejs/kit';
import { hydrate } from '$lib/hooks/store.hook';

export const handleEndpoint: Handle = async ({ event, resolve }) => {
	return resolve(event);
};

export const handlePages: Handle = async ({ event, resolve }) => {
	const res = await resolve(event);

	let body = await res.text();
	if (res.status === 200) {
		body = body.replace(
			'$__PRELOADED_STATE__',
			JSON.stringify(await hydrate(event.request), (key, value) => {
				if (typeof value === 'bigint') {
					return Number(value);
				}

				return value;
			})
		);
	} else {
		body = body
			.replace('$__PRELOADED_CLIENT_CONFIGS__', null)
			.replace('$__PRELOADED_STATE__', null);
	}

	return new Response(body, {
		headers: res.headers,
		status: res.status,
		statusText: res.statusText,
	});
};

export const handle: Handle = async (inp) => {
	// Handle for endpoint
	if (inp.event.url.pathname.startsWith('/api')) {
		return handleEndpoint(inp);
	}

	// Handle for pages
	return handlePages(inp);
};
