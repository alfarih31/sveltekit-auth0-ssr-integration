<script context="module" lang="ts">
	const escapeRegExp = (str: string) => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

	const filterBy = (term: string) => {
		const re = new RegExp(escapeRegExp(term), 'i');
		return (person: any) => {
			for (let prop in person) {
				if (!person.hasOwnProperty(prop)) {
					continue;
				}
				if (re.test(person[prop])) {
					return true;
				}
			}
			return false;
		};
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import List, { Item, Text } from '@smui/list';
	import countryCode from './data-country-code';
	import Textfield from '@smui/textfield';

	export let actionSelect: any = null;
	export let isSelected: string = '';

	let listData = [];

	onMount(() => {
		listData = countryCode();
	});

	let searchValue = '';

	$: filteredList = listData.filter(filterBy(searchValue));
</script>

<Textfield label="Search" bind:value={searchValue} type="text" style="left: 10px" />
<List style="max-height: 20vh; overflow-y: auto;">
	{#each filteredList as data}
		<Item
			id={data.dial_code}
			aria-label={data.code}
			on:SMUI:action={actionSelect}
			selected={isSelected === data.dial_code}
		>
			<Text>{data.name} ({data.dial_code})</Text>
		</Item>
	{/each}
</List>
