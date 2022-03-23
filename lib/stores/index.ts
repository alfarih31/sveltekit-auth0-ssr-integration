import type { UIStore } from '$dto/stores';
import uiStore from '$lib/stores/ui.store';
import type { Store } from '$dto/stores';
import { browser } from '$app/env';
import { writable } from 'svelte/store';

const initState: Store = {
	uiState: uiStore,
};

// Hydrating state
if (browser) {
	if (window.__PRELOADED_STATE__) {
		Object.assign(initState, window.__PRELOADED_STATE__);
	}
}

export const uiState = writable<UIStore>(initState.uiState);
