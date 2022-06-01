import cookie from 'cookie';
import { decryptString } from '$lib/modules/crypto';
import { COOKIES_KEY, SUBJECT } from '$lib/CONSTANTS';
import { webAuthClient } from '$lib/services/clients/parties/auth0';
import type { Auth0UserProfile } from 'auth0-js';

const validateToken = async (token) =>
	new Promise<Auth0UserProfile>((resolve, reject) => {
		webAuthClient.validateToken(token, 'nonce', function (error, result) {
			if (error) {
				return reject(error);
			}

			return resolve(result);
		});
	});

export const getSessionFromRequest = async (req: Request): Promise<App.Session> => {
	const cookiesStr = req.headers.get('cookie') || '';

	const cookies = cookie.parse(cookiesStr, {
		decode: decryptString,
	});
	const token = cookies[COOKIES_KEY.USER_TOKEN];
	const idToken = cookies[COOKIES_KEY.USER_ID_TOKEN];

	// return empty if not exist
	if (!token || !idToken) {
		return {
			actor: {
				userID: '',
				subjectID: SUBJECT.PUBLIC,
			},
			provider: '',
		};
	}

	// Decode token if exist
	try {
		const res = await validateToken(idToken);
		const [provider, userID] = res.sub.split('|');
		return {
			actor: {
				userID,
				subjectID: SUBJECT.USER,
			},
			provider,
		};
	} catch (err) {
		return {
			actor: {
				userID: '',
				subjectID: SUBJECT.PUBLIC,
			},
			provider: '',
		};
	}
};

export const getUserTokenFromRequest = (req: Request): string => {
	const cookiesStr = req.headers.get('cookie') || '';

	const cookies = cookie.parse(cookiesStr, {
		decode: decryptString,
	});

	return cookies[COOKIES_KEY.USER_TOKEN];
};

export const getUserManagementTokenFromRequest = (req: Request): string => {
	const cookiesStr = req.headers.get('cookie') || '';

	const cookies = cookie.parse(cookiesStr, {
		decode: decryptString,
	});

	return cookies[COOKIES_KEY.USER_MANAGEMENT_TOKEN];
};
