import cookie from 'cookie';
import { decryptString } from '$lib/modules/crypto';
import { AUDIENCE, COOKIES_KEY, SUBJECT } from '$lib/CONSTANTS';
import Jwt from '$lib/modules/jwt';

export const getSessionFromRequest = async (req: Request): Promise<App.Session> => {
	const cookiesStr = req.headers.get('cookie') || '';

	const cookies = cookie.parse(cookiesStr, {
		decode: decryptString,
	});
	const token = cookies[COOKIES_KEY.USER_TOKEN];

	// return empty if not exist
	if (!token) {
		return {
			actor: {
				userID: 0,
				subjectID: SUBJECT.PUBLIC,
			},
		};
	}

	// Decode token if exist
	try {
		const payload = Jwt.verify({ token, audience: AUDIENCE.ACCESS_CMS }, 'TESTKEY');
		return {
			actor: {
				userID: 1,
				subjectID: parseInt(payload.sub, 10),
			},
		};
	} catch (err) {
		return {
			actor: {
				userID: 0,
				subjectID: SUBJECT.PUBLIC,
			},
		};
	}
};
