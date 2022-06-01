import type { UIStore, UserStore } from '$dto/stores';
import uiStore from '$lib/stores/ui.store';
import type { Store } from '$dto/stores';
import { browser } from '$app/env';
import { writable } from 'svelte/store';
import userStore from '$lib/stores/user.store';

const initState: Store = {
	uiState: uiStore,
	userState: userStore,
};

// Hydrating state
if (browser) {
	if (window.__PRELOADED_STATE__) {
		Object.assign(initState, window.__PRELOADED_STATE__);
	}
}

export const uiState = writable<UIStore>(initState.uiState);
export const userState = writable<UserStore>(initState.userState);
