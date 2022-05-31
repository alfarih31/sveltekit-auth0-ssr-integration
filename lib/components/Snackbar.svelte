<script lang="ts">
	import type { SnackbarStore } from '$dto/stores';
	import Snackbar, { Label, Actions, SnackbarComponentDev } from '@smui/snackbar';
	import IconButton from '@smui/icon-button';
	import { uiState } from '$lib/stores';
	import { onMount } from 'svelte';
	import classnames from '$lib/modules/classnames';
	import { hideSnackbar } from '$lib/stores/actions';

	let snackbarEl: SnackbarComponentDev;
	let localState: Partial<SnackbarStore> = {};

	onMount(() =>
		uiState.subscribe(({ snackbar }) => {
			if (snackbar.show !== localState.show) {
				localState = snackbar;
				if (localState.show) {
					snackbarEl.open();
				}
			}
		})
	);

	const onClosed = () => {
		if (localState.onClose) {
			localState.onClose();
			localState.onClose = undefined;
		}

		hideSnackbar();
	};
</script>

<Snackbar
	bind:this={snackbarEl}
	on:SMUISnackbar:closed={onClosed}
	class={classnames({ [`material-snackbar__${localState.severity}`]: true })}
>
	<Label>{localState.message}</Label>
	<Actions>
		<IconButton class="material-icons" title="Dismiss">close</IconButton>
	</Actions>
</Snackbar>
