<script lang="ts">
	import AppBar from '$components/AppBar.svelte';
	import AppDrawer from '$components/AppDrawer/index.svelte';
	import { TopAppBarComponentDev } from '@smui/top-app-bar';
	import Snackbar from '$components/Snackbar.svelte';
	import Footer from '$components/layouts/Footer.svelte';

	let topAppBar: TopAppBarComponentDev;
	let drawerOpen = false;

	let toggleDrawer = () => {
		drawerOpen = !drawerOpen;
	};
</script>

<Snackbar />

<AppBar bind:topAppBar bind:drawerOpen {toggleDrawer} />
<AppDrawer bind:open={drawerOpen} {toggleDrawer} />

<main class={`Main ${drawerOpen ? 'DrawerOpen' : ''}`}>
	<slot />
</main>

<Footer bind:drawerOpen />
