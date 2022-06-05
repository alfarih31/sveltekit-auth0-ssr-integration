import { Configs } from '$dto/config';
import type { Store } from '$dto/stores';

export {};

declare global {
	interface KeyValue {
		[key: string]: any;
	}

	interface Window {
		__PRELOADED_STATE__?: Store;
		__PRELOADED_CLIENT_CONFIGS__?: Configs.ClientConfigs;
	}

	declare module '$configs/server?server' {
		import all from '$configs/server';
		export = all;
	}

	declare module '$configs/client/client.config?client' {
		import all from '$configs/client/client.config';
		export = all;
	}

	// fallback
	declare module '*?client';
	declare module '*?server';
}
