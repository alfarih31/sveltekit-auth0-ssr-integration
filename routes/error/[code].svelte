<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from '@sveltejs/kit';

	export async function load({ params }: LoadInput): Promise<LoadOutput> {
		return {
			props: {
				status: params.code,
			},
		};
	}
</script>

<script lang="ts">
	import Error from '$components/Error.svelte';

	export let status: number;
</script>

<Error {status} />
