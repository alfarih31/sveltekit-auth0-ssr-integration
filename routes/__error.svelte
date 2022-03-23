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
	import Error from '$components/Error.svelte';

	export let status: number;
	export let error: Error;
</script>

<Error {status} {error} />
