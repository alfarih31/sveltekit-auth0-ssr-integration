<script lang="ts">
	import type { Configs } from '$lib/dto/config';
	import Builder from './Builder.svelte';
	import { Text, Item, Graphic, Meta } from '@smui/list';
	import Accordion, { Panel, Content } from '@smui-extra/accordion';

	export let nav: Configs.NavigationConfig;

	let panelOpen = nav?.expanded === true;

	function togglePanelOpen() {
		panelOpen = !panelOpen;
		if (nav.onClick) {
			nav.onClick();
		}
	}
</script>

<div class={`DrawerMenu__Group ${nav.omit === true && 'display-hidden'}`}>
	<Item class="DrawerMenu__Item" on:click={togglePanelOpen}>
		<Graphic class="material-icons Item__Icon" aria-hidden="true">{nav.icon}</Graphic>
		<Text class="Item__Text">
			{nav.title}
		</Text>

		<Meta class="material-icons">
			{#if panelOpen}
				expand_less
			{:else}expand_more
			{/if}
		</Meta>
	</Item>

	<Accordion multiple>
		<Panel bind:open={panelOpen} variant="unelevated">
			<Content class="SubGroup">
				{#if nav.children}
					{#each nav.children as n}
						<Builder nav={n} />
					{/each}
				{/if}
			</Content>
		</Panel>
	</Accordion>
</div>
