import { USER_ROLE } from '$lib/CONSTANTS';
import type { RouteConfig } from '$lib/dto/config';

export const homePath = '/';
export const loginPath = '/login';

const routeConfig: { [key: string]: RouteConfig } = {
	[homePath]: {
		permissions: [USER_ROLE.PERSONAL, USER_ROLE.ADMIN],
	},
	'/personal': {
		permissions: [USER_ROLE.PERSONAL],
	},
	'/login': {
		fullLayout: true,
	},
};

export default routeConfig;
