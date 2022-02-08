<script lang="ts">
	import { session } from '$app/stores';
	import TextField from '@smui/textfield';
	import Card, { Actions, Content } from '@smui/card';
	import Button from '@smui/button';
	import Auth from '$lib/adaptors/auth';
	import { snackbar } from '$lib/stores/ui';
	import { goto } from '$app/navigation';

	let username: string = '';
	let password: string = '';

	session.subscribe(() => {});

	async function handleLogin() {
		try {
			await Auth.login(username, password, session);

			await goto('/');
		} catch (e) {
			snackbar.update(() => ({
				show: true,
				text: e.message,
			}));
		}
	}
</script>

<div class="login-container">
	<Card>
		<Content>
			<h5 style="margin: 0">Login</h5>
			<h6 style="margin: 0">Welcome</h6>
			<TextField label="Username" bind:value={username} style="width: 100%" />
			<TextField label="Password" bind:value={password} type="password" style="width: 100%" />
		</Content>
		<Actions>
			<Button on:click={handleLogin}>Login</Button>
		</Actions>
	</Card>
</div>

<style lang="scss">
	:global(.mdc-card) {
		width: 30%;
	}

	.login-container {
		width: 100%;
		height: 100%;
		margin: auto;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
