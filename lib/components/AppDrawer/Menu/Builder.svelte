<script lang="ts">
	import Item from './Item.svelte';
	import type { NavigationConfig } from '$lib/dto/config';
	import { TYPE } from '$configs/navigation.config';
	import Group from './Group.svelte';
	import { session } from '$app/stores';

	export let nav: NavigationConfig;

	let show = true;
	session.subscribe((s) => {
		if (Array.isArray(nav.permissions) && s.role) {
			show = nav.permissions.includes(s.role);
		}
	});
</script>

{#if show}
	{#if nav.type === TYPE.ITEM}
		<Item {nav} />
	{:else if nav.type === TYPE.GROUP}
		<Group {nav} />
	{/if}
{/if}
