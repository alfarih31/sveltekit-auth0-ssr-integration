import { writable } from 'svelte/store';

export const drawerOpen = writable(false);

export const snackbar = writable({
	text: '',
	show: false,
});
