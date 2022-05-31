export type UIStore = {
	snackbar: SnackbarStore;
};

export type SnackbarSeverity = 'error' | 'warning' | 'info' | 'success';

export type SnackbarStore = {
	show: boolean;
	message: string;
	severity: SnackbarSeverity;
	onClose: () => void;
};

export type Store = {
	uiState: UIStore;
};
