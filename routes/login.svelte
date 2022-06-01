<script lang="ts">
	import Card, { Actions } from '@smui/card';
	import Button from '@smui/button';
	import { showSnackbar } from '$lib/stores/actions';
	import { goto } from '$app/navigation';
	import { authenticateClient } from '$lib/services/clients/parties/auth0';
	import clientConfigs from '$configs/client/client.config';

	async function handleLogin() {
		try {
			const url = authenticateClient.buildAuthorizeUrl({
				audience: `https://${clientConfigs.AUTH0_DOMAIN}/api/v2/`,
				responseType: 'code',
				responseMode: 'query',
				redirectUri: window.location.origin + '/api/auth/callback',
				scope: 'offline_access profile openid email',
				nonce: 'nonce',
			});

			await goto(url);
		} catch (err) {
			showSnackbar(err.message, { severity: 'error' });
		}
	}
</script>

<div class="FlexContainer--Center">
	<Card>
		<Actions>
			<Button on:click={handleLogin}>Login</Button>
		</Actions>
	</Card>
</div>
