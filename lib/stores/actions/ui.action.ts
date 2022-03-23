import type { SnackbarSeverity } from '$dto/stores';
import { uiState } from '$lib/stores';
import uiStore from '$lib/stores/ui.store';

export const showSnackbar = (message: string, severity: SnackbarSeverity = 'success') => {
	uiState.update((s) => ({
		...s,
		snackbar: {
			show: true,
			message,
			severity,
		},
	}));
};

export const hideSnackbar = () => {
	uiState.update((s) => ({
		...s,
		snackbar: uiStore.snackbar,
	}));
};
