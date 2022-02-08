<script lang="ts">
	import Snackbar, { Label, SnackbarComponentDev, Actions } from '@smui/snackbar';
	import IconButton from '@smui/icon-button';
	import { snackbar } from '$lib/stores/ui';

	let snackbarEl: SnackbarComponentDev;
	let text: string = '';
	let show = false;

	snackbar.subscribe((s) => {
		if (s.show && !show) {
			show = true;
			text = s.text;
			snackbarEl.open();
		}
	});

	function handleClose() {
		text = '';
		show = false;
		snackbar.set({
			show: false,
			text: '',
		});
	}
</script>

<Snackbar bind:this={snackbarEl} on:SMUISnackbar:closed={handleClose}>
	<Label>{text}</Label>
	<Actions>
		<IconButton class="material-icons" title="Dismiss">close</IconButton>
	</Actions>
</Snackbar>
