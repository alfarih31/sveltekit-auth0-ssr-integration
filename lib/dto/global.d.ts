import type {} from '$dto/stores';

export {};

declare global {
	interface KeyValue {
		[key: string]: any;
	}

	interface Window {
		__PRELOADED_STATE__?: State;
	}
}
