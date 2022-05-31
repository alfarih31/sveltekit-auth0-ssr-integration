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

	interface ClientConfigs {}
}
