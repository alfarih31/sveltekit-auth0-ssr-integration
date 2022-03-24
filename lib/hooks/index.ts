import type { GetSession, Handle } from '@sveltejs/kit';
import type { MaybePromise, RequestEvent } from '@sveltejs/kit/types/private';
import { hydrate } from '$lib/hooks/store.hook';
import { getSessionFromRequest } from '$lib/hooks/auth.hook';

export const handle: Handle = async ({ event, resolve }) => {
	const states = hydrate(event.request);

	event.locals.session = getSessionFromRequest(event.request);

	return resolve(event, {
		transformPage: ({ html }) => {
			return html.replace('$__PRELOADED_STATE__', JSON.stringify(states));
		},
	});
};

export const getSession: GetSession = (req: RequestEvent): MaybePromise<App.Session> => {
	if (!req.locals.session) {
		req.locals.session = {
			authenticated: false,
			role: 0,
			userID: 0,
		};
	}

	return req.locals.session;
};
