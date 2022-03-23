<script lang="ts">
	import Item from './Item.svelte';
	import type { NavigationConfig } from '$lib/dto/config';
	import { TYPE } from '$configs/navigation.config';
	import Group from './Group.svelte';

	export let nav: NavigationConfig;
</script>

{#if nav.type === TYPE.ITEM}
	<Item {nav} />
{:else if nav.type === TYPE.GROUP}
	<Group {nav} />
{/if}
