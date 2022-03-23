import type { State } from '$dto/states';

export {};

declare global {
	interface KeyValue {
		[key: string]: any;
	}

	interface Window {
		__PRELOADED_STATE__?: State;
	}
}
