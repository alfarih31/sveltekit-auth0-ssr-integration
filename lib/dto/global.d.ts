import { Configs } from '$dto/config';

export {};

declare global {
	interface KeyValue {
		[key: string]: any;
	}

	interface Window {
		__PRELOADED_STATE__?: State;
		__PRELOADED_CLIENT_CONFIGS__?: Configs.ClientConfigs;
	}
}
