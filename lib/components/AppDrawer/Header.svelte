<script lang="ts">
	import { Header } from '@smui/drawer';
	import { Separator } from '@smui/list';
	import IconButton from '@smui/icon-button';
	import { homePath } from '$configs/client/route.config';
	import { userState } from '$lib/stores';

	export let toggleDrawer: () => void;
</script>

<div class="DrawerControl">
	<IconButton class="material-icons" on:click={toggleDrawer} size="mini">chevron_left</IconButton>
</div>
<Separator />
<Header class="DrawerHeader">
	<a class="mdc-drawer__header-content" href={homePath}>
		<img
			src={$userState.profile.picture || '/img/logo.png'}
			alt={import.meta.env.VITE_APP_NAME}
			class="img-fluid"
		/>
		<div class="mdc-typography--headline6 DrawerHeader__Title">
			{$userState.profile.nickname || import.meta.env.VITE_APP_NAME}
		</div>
	</a>
</Header>
