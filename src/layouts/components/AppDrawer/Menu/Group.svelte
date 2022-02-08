<script lang="ts">
	import type { NavigationConfig } from '$lib/dto/config';
	import IconButton from '@smui/icon-button';
	import { Panel } from '@smui-extra/accordion';
	import Builder from './Builder.svelte';
	import { Text } from '@smui/list';
	import Accordion from '@smui-extra/accordion';

	export let nav: NavigationConfig;

	let panelOpen = nav?.expanded === true;

	function togglePanelOpen() {
		panelOpen = !panelOpen;
		if (nav.onClick) {
			nav.onClick();
		}
	}
</script>

<span id={nav.id} class="mdc-deprecated-list-item mdc-ripple-upgraded" on:click={togglePanelOpen}>
	<span class="mdc-deprecated-list-item__ripple" />
	<span class="list-item__content">
		<span class="list-item__content__icon-text">
			<i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">{nav.icon}</i>

			<Text>
				{nav.title}
			</Text>
		</span>

		<IconButton class="material-icons list-item__content__expand-button">
			{#if panelOpen}
				expand_less
			{:else}expand_more
			{/if}
		</IconButton>
	</span>
</span>

<Accordion multiple>
	<Panel bind:open={panelOpen} variant="unelevated">
		<div class="smui-paper__content">
			{#if nav.children}
				{#each nav.children as n}
					<Builder nav={n} />
				{/each}
			{/if}
		</div>
	</Panel>
</Accordion>

<style lang="scss">
	@import 'src/assets/scss/variables';
	.smui-paper__content {
		padding: 0 !important;
		padding-left: 0.5rem !important;
	}

	.list-item__content {
		display: flex;
		justify-content: space-between;
		width: 100%;
		align-items: center;

		&__icon-text {
			display: flex;
			justify-content: flex-start;
			width: 100%;
			align-items: center;

			.material-icons {
				color: $color-1;
			}
		}
	}
</style>
