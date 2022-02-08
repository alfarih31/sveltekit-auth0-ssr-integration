<script lang="ts">
	import { Header } from '@smui/drawer';
	import { Separator } from '@smui/list';
	import IconButton from '@smui/icon-button';

	export let toggleDrawer: () => void;
</script>

<div class="mdc-drawer__control">
	<IconButton class="material-icons" on:click={toggleDrawer}>chevron_left</IconButton>
</div>
<Separator />
<Header>
	<a class="mdc-drawer__header-content" href={import.meta.env.VITE_PUBLIC_URL}>
		<img src="/img/logo.png" alt={import.meta.env.VITE_APP_NAME} />
		<div class="mdc-typography--headline6">{import.meta.env.VITE_APP_NAME}</div>
	</a>
</Header>

<style lang="scss">
	.mdc-drawer {
		&__control {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			padding: 0.25rem 0.25rem;
			height: fit-content;
		}

		&__header-content {
			display: flex;
			justify-content: center;
			align-items: center;
			height: fit-content;
			flex-direction: column;
			text-decoration: none;
			color: black;
		}
	}
</style>
