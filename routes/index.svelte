<script lang="ts">
	import Paper, { Content } from '@smui/paper';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import Button from '@smui/button';
	import { userState } from '$lib/stores';
	import { onMount } from 'svelte';

	let disableResendEmail: boolean = false;
	let stats: Promise<{ totalSignedUp: number; logins: number; weeklyLogins: number }> =
		new Promise<{
			totalSignedUp: number;
			logins: number;
			weeklyLogins: number;
		}>(() => {});

	const getStats = async () => {
		try {
			const res = await fetch('/api/stats');
			stats = res.json();
		} catch (err) {
			console.error(err);
		}
	};

	const resendVerificationEmail = async () => {
		disableResendEmail = true;
		await fetch('/api/auth/resend-email');
	};

	onMount(() => {
		getStats();
	});
</script>

{#if !$userState.profile.id || (!$userState.profile.email_verified && $userState.profile.provider === 'auth0')}
	<Paper class="cms-dashboard__paper">
		<Content>
			<div class="mdc-typography--subtitle1">Email not verified</div>
			<Button disabled={disableResendEmail} on:click={resendVerificationEmail}
				>Resend verification email</Button
			>
		</Content>
	</Paper>
{:else}
	<Paper class="cms-dashboard__paper">
		<Content>
			<LayoutGrid>
				<Cell span="4">
					<div class="mdc-typography--headline6">Name</div>
					<div class="mdc-typography--subtitle1">
						{$userState.profile.nickname || ''}
					</div>
				</Cell>
				<Cell span="4">
					<div class="mdc-typography--headline6">Email</div>
					<div class="mdc-typography--subtitle1">
						{$userState.profile.email || ''}
					</div>
				</Cell>
				<Cell span="4">
					<div class="mdc-typography--headline6">Email Status</div>
					<div class="mdc-typography--subtitle1">
						{$userState.profile.email_verified ? 'Verified' : 'Not Verified'}
					</div>
				</Cell>
			</LayoutGrid>
		</Content>
	</Paper>

	<Paper class="cms-dashboard__paper">
		<Content>
			<LayoutGrid>
				<Cell span="4">
					<div class="mdc-typography--headline6">Total sign up</div>
					<div class="mdc-typography--subtitle1">
						{#await stats}
							Loading...
						{:then stats}
							{stats.totalSignedUp}
						{/await}
					</div>
				</Cell>
				<Cell span="4">
					<div class="mdc-typography--headline6">Total sign in today</div>
					<div class="mdc-typography--subtitle1">
						{#await stats}
							Loading...
						{:then stats}
							{stats.logins}
						{/await}
					</div>
				</Cell>
				<Cell span="4">
					<div class="mdc-typography--headline6">Total weekly sign in</div>
					<div class="mdc-typography--subtitle1">
						{#await stats}
							Loading...
						{:then stats}
							{stats.weeklyLogins}
						{/await}
					</div>
				</Cell>
			</LayoutGrid>
		</Content>
	</Paper>
{/if}
