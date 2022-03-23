import type { UIStore } from '$dto/stores';

const uiStore: UIStore = {
	snackbar: {
		show: false,
		message: '',
		severity: 'success',
	},
};

export default uiStore;
