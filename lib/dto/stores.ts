export type UIStore = {
	snackbar: SnackbarStore;
};

export type SnackbarSeverity = 'error' | 'warning' | 'info' | 'success';

export type SnackbarStore = {
	show: boolean;
	message: string;
	severity: SnackbarSeverity;
};

export type Store = {
	uiState: UIStore;
};
