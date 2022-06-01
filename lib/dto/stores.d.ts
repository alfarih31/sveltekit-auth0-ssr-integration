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

export type UserStore = {
	profile: Partial<User.Profile>;
};

export type Store = {
	uiState: UIStore;
	userState: UserStore;
};
