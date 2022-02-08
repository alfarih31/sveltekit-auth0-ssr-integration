<script context="module" lang="ts">
	import type { ErrorLoadInput, LoadOutput } from '@sveltejs/kit';

	export function load(arg: ErrorLoadInput): LoadOutput {
		const { status, error } = arg;

		return {
			props: {
				status,
				error,
			},
		};
	}
</script>

<script lang="ts">
	import Button, { Label } from '@smui/button';
	import { Icon } from '@smui/icon-button';
	import { homePath } from '$configs/route.config';

	export let status: number;
	export let error: Error;
</script>

<svelte:head>
	<title>{import.meta.env.VITE_APP_NAME} - {status}</title>
</svelte:head>

<div
	style="margin: auto;display: flex;justify-content: center; align-items: center; width: 100%; height: 100%; flex-direction: column"
>
	<div class="mdc-typography--headline1">{status}</div>

	{#if error}
		<div class="mdc-typography--headline2">{error.message}</div>
	{/if}

	<Button href={homePath}>
		<Icon class="material-icons">home</Icon>
		<Label>Back to home</Label>
	</Button>
</div>

<style>
	h1,
	p {
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	p {
		margin: 1em auto;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>
