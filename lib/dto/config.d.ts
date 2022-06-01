import type { MaybePromise } from '@sveltejs/kit/types/private';

declare namespace Configs {
	interface NavigationConfig {
		id: string;
		title: string;
		type: string;
		icon: string;
		linkTo?: string;
		onClick?: () => MaybePromise<void>;
		expanded?: boolean;
		children?: NavigationConfig[];
		permissions?: number[];
		omit?: boolean;
	}

	interface RouteConfig {
		permissions?: number[];
		fullLayout?: boolean;
	}

	interface ClientConfigs {
		AUTH0_DOMAIN: string;
		AUTH0_CLIENT_ID: string;
	}

	interface ServerConfigs extends ClientConfigs {
		AUTH0_CLIENT_SECRET: string;
	}
}
