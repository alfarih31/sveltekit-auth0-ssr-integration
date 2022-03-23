<script lang="ts">
	import Snackbar, { Label, SnackbarComponentDev, Actions } from '@smui/snackbar';
	import IconButton from '@smui/icon-button';
	import { uiState } from '$lib/stores';
	import { hideSnackbar } from '$lib/stores/actions';
	import { onMount } from 'svelte';

	let snackbarEl: SnackbarComponentDev;
	let message: string = '';
	let show = false;

	onMount(() =>
		uiState.subscribe(({ snackbar }) => {
			if (snackbar.show !== show) {
				show = snackbar.show;
				message = snackbar.message;
				snackbarEl.open();
			}
		})
	);
</script>

<Snackbar bind:this={snackbarEl} on:SMUISnackbar:closed={hideSnackbar}>
	<Label>{message}</Label>
	<Actions>
		<IconButton class="material-icons" title="Dismiss">close</IconButton>
	</Actions>
</Snackbar>
