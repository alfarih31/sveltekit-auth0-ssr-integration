<script lang="ts">
	import type { NavigationConfig } from '$lib/dto/config';
	import { Item, Text } from '@smui/list';

	export let nav: NavigationConfig;
</script>

<Item id={nav.id} href={nav.linkTo} on:click={nav.onClick}>
	<i class="material-icons mdc-deprecated-list-item__graphic" aria-hidden="true">{nav.icon}</i>

	<Text>
		{nav.title}
	</Text>
</Item>

<style lang="scss">
	@import 'src/assets/scss/variables';

	.material-icons {
		color: $color-1;
	}
</style>
