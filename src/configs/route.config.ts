import { USER_ROLE } from '$lib/CONSTANTS';
import type { RouteConfig } from '$lib/dto/config';

export const homePath = '/';
export const loginPath = '/login';

const routeConfig: { [key: string]: RouteConfig } = {
	'/personal': {
		permissions: [USER_ROLE.PERSONAL],
	},
	'/login': {
		fullLayout: true,
		permissions: [],
	},
};

export default routeConfig;
