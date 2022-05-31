<script lang="ts">
	import type { Configs } from '$lib/dto/config';
	import { Item, Text, Graphic } from '@smui/list';

	export let nav: Configs.NavigationConfig;
</script>

<Item
	id={nav.id}
	href={nav.linkTo}
	on:click={nav.onClick}
	class={`DrawerMenu__Item ${nav.omit === true && 'display-hidden'}`}
>
	<Graphic class="material-icons Item__Icon" aria-hidden="true">{nav.icon}</Graphic>

	<Text class="Item__Text">
		{nav.title}
	</Text>
</Item>
