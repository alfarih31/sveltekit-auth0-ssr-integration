import { SUBJECT } from '$lib/CONSTANTS';
import type { Configs } from '$lib/dto/config';

export const homePath = '/';
export const loginPath = '/login';
export const logoutPath = '/logout';
export const requestEmailVerifyPath = '/request-email-verify';

const routeConfig: { [key: string]: Configs.RouteConfig } = {
	[homePath]: {
		permissions: [SUBJECT.USER],
	},
	'/profile': {
		permissions: [SUBJECT.USER],
	},
	'/login': {
		fullLayout: true,
		permissions: [SUBJECT.PUBLIC],
	},
	'/reset-password': {
		permissions: [SUBJECT.USER],
	},
	'/request-email-verify': {
		permissions: [SUBJECT.USER],
	},
};

export default routeConfig;
