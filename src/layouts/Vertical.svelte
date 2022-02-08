<script lang="ts">
	import { AppContent } from '@smui/drawer';
	import AppBar from './components/AppBar.svelte';
	import AppDrawer from './components/AppDrawer/index.svelte';
	import { TopAppBarComponentDev, AutoAdjust } from '@smui/top-app-bar';
	import Snackbar from './components/Snackbar.svelte';

	let topAppBar: TopAppBarComponentDev;
	let drawerOpen = false;

	let toggleDrawer = () => {
		drawerOpen = !drawerOpen;
	};
</script>

<Snackbar />

<AppDrawer bind:open={drawerOpen} {toggleDrawer} />

<AppContent class="app-content">
	<AppBar bind:topAppBar {toggleDrawer} />

	<AutoAdjust {topAppBar}>
		<slot />
	</AutoAdjust>
</AppContent>

<style lang="scss">
	* :global(.app-content) {
		flex: auto;
		overflow: auto;
		position: relative;
		flex-grow: 1;
	}
</style>
