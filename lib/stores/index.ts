import type { UIStore, UserStore } from '$dto/stores';
import uiStore from '$lib/stores/ui.store';
import type { Store } from '$dto/stores';
import { writable } from 'svelte/store';
import userStore from '$lib/stores/user.store';
import { getProfile } from '$lib/services/api/internal-proxy/user';

const initState: Store = {
	uiState: uiStore,
	userState: userStore,
};

export const uiState = writable<UIStore>(initState.uiState);
export const userState = writable<UserStore>(initState.userState);

userState.update((prev) => {
	getProfile()
		.then((res) => {
			userState.set({ ...prev, profile: res });
		})
		.catch((err) => {
			console.error(err);
		});
	return initState.userState;
});
