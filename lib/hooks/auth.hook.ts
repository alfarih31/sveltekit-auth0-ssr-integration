import cookie from 'cookie';
import { decryptString } from '$lib/modules/crypto';
import { COOKIES_KEY } from '$lib/CONSTANTS';

export const getSessionFromRequest = (req: Request): App.Session => {
	const cookies = cookie.parse(req.headers.get('cookie') || '', {
		decode: decryptString,
	});
	const sessionStr = cookies[COOKIES_KEY.SESSION];
	if (sessionStr) {
		return JSON.parse(sessionStr);
	}

	return {
		authenticated: false,
		userID: 0,
		role: 0,
	};
};
