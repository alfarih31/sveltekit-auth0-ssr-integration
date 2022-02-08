<script lang="ts">
	import TopAppBar, { TopAppBarComponentDev, Row, Section, Title } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';

	export let drawerOpen = false;
	export let toggleDrawer: () => void;
	export let topAppBar: TopAppBarComponentDev;
</script>

<TopAppBar bind:this={topAppBar} variant="standard">
	<Row>
		<Section>
			{#if !drawerOpen}
				<IconButton class="material-icons" on:click={toggleDrawer}>menu</IconButton>
			{/if}

			<Title>AppBar Title</Title>
		</Section>
	</Row>
</TopAppBar>
