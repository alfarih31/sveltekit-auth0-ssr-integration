<script lang="ts">
	import TextField from '@smui/textfield';
	import Card, { Actions, Content } from '@smui/card';
	import Button from '@smui/button';
	import { showSnackbar } from '$lib/stores/actions';
	import { login } from '$lib/services/api/auth';
	import { goto } from '$app/navigation';
	import { homePath } from '$configs/client/route.config';

	let username: string = '';
	let password: string = '';

	async function handleLogin() {
		try {
			await login(username, password);

			goto(homePath, { replaceState: true }).then(() => showSnackbar('Logged in...'));
		} catch (err) {
			showSnackbar(err.message, 'error');
		}
	}
</script>

<div class="FlexContainer--Center">
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
