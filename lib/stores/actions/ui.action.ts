import type { SnackbarSeverity } from '$dto/stores';
import { uiState } from '$lib/stores';
import uiStore from '$lib/stores/ui.store';

export const showSnackbar = (
	message: string,
	opts: {
		severity?: SnackbarSeverity;
		onClose?: () => void;
	} = {}
) => {
	uiState.update((s) => ({
		...s,
		snackbar: {
			show: true,
			message,
			severity: opts.severity,
			onClose: opts.onClose,
		},
	}));
};

export const hideSnackbar = () => {
	uiState.update((s) => ({
		...s,
		snackbar: {
			...uiStore.snackbar,
		},
	}));
};
