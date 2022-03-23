import type { MaybePromise } from '@sveltejs/kit/types/helper';

export interface NavigationConfig {
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

export interface RouteConfig {
	permissions?: number[];
	fullLayout?: boolean;
}
