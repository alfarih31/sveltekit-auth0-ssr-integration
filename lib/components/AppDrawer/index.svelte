<script lang="ts">
	import Drawer, { Content } from '@smui/drawer';
	import Header from './Header.svelte';
	import Builder from './Menu/Builder.svelte';
	import navs from '$configs/navigation.config';

	import List from '@smui/list';

	export let toggleDrawer: () => void;
	export let open: boolean;
</script>

<Drawer variant="dismissible" bind:open class="Drawer">
	<Header {toggleDrawer} />
	<Content class="DrawerContent">
		<List class="DrawerMenu">
			{#each navs as nav}
				<Builder {nav} />
			{/each}
		</List>
	</Content>
</Drawer>
