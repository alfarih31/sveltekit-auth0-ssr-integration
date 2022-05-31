import routeConfig, { loginPath } from '$configs/client/route.config';
import { ERR_FORBIDDEN, ERR_UNAUTHORIZED } from '$lib';

export const getRoutePermission = (pathname: string, session: App.Session): boolean => {
	const c = routeConfig[pathname];
	if (!c || !c.permissions) {
		return true;
	}

	if (session) {
		return c.permissions.length > 0 && c.permissions.includes(session.actor.subjectID);
	}

	return c.permissions.length === 0;
};

export const authCheck = (
	_pathname: string,
	_session: App.Session
): { status: number; redirect?: string; error?: Error } => {
	const isAllowed = getRoutePermission(_pathname, _session);

	if (!isAllowed) {
		if (!_session.actor.userID && !_session.actor.subjectID) {
			return {
				status: 403,
				error: ERR_FORBIDDEN,
			};
		}

		if (_pathname !== loginPath) {
			return {
				status: 302,
				redirect: loginPath,
			};
		}

		if (_pathname === loginPath) {
			return {
				status: 403,
				error: ERR_FORBIDDEN,
			};
		}

		return {
			status: 401,
			error: ERR_UNAUTHORIZED,
		};
	}

	return {
		status: 200,
	};
};
