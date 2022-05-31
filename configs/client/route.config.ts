import { SUBJECT } from '$lib/CONSTANTS';
import type { Configs } from '$lib/dto/config';

export const homePath = '/';
export const loginPath = '/login';

const routeConfig: { [key: string]: Configs.RouteConfig } = {
	[homePath]: {
		permissions: [SUBJECT.ADMIN],
	},
	'/personal': {
		permissions: [SUBJECT.ADMIN],
	},
	'/login': {
		fullLayout: true,
		permissions: [SUBJECT.PUBLIC],
	},
};

export default routeConfig;
