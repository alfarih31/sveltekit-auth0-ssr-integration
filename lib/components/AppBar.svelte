<script lang="ts">
	import TopAppBar, { TopAppBarComponentDev, Row, Section, Title } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';

	export let drawerOpen = false;
	export let toggleDrawer: () => void;
	export let topAppBar: TopAppBarComponentDev;
</script>

<TopAppBar
	bind:this={topAppBar}
	variant="fixed"
	class={`AppBar ${drawerOpen ? 'DrawerOpen' : ''}`}
	dense
>
	<Row>
		<Section>
			<IconButton class="material-icons MenuIcon" on:click={toggleDrawer}>menu</IconButton>

			<Title>THIS WILL BE TOOLBAR</Title>
		</Section>
	</Row>
</TopAppBar>
