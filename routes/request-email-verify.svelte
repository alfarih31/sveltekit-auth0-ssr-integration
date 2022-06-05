<script lang="ts">
	import Paper, { Content } from '@smui/paper';
	import Button from '@smui/button';
	import { showSnackbar } from '$lib/stores/actions';
	import { userState } from '$lib/stores';

	let disableResendEmail = false;
	let resendCountdown = 0;
	let countdownInterval: NodeJS.Timer;

	const resendVerificationEmail = async () => {
		disableResendEmail = true;
		resendCountdown = 30;
		countdownInterval = setInterval(function () {
			resendCountdown--;
			if (resendCountdown === 0) {
				clearInterval(countdownInterval);
				disableResendEmail = false;
			}
		}, 1000);
		try {
			await fetch('/api/auth/resend-email');
		} catch (err) {
			showSnackbar(err.message, { severity: 'error' });
			clearInterval(countdownInterval);
			disableResendEmail = false;
		}
	};

	const handleHardReload = () => {
		window.location.href = window.location.href;
	};
</script>

<div class="mdc-typography--headline3" style="margin: 1rem">Verify Email</div>
<Paper class="cms-dashboard__paper">
	<Content>
		{#if $userState.profile.id && $userState.profile.provider === 'auth0' && !$userState.profile.email_verified}
			<div class="mdc-typography--headline6">Oops! Your email not verified</div>
			<div class="FlexContainer FlexContainer--Center--Col">
				<Button disabled={disableResendEmail} on:click={resendVerificationEmail}>
					{#if resendCountdown > 0}
						{`Check your mailbox! you can retry in ${resendCountdown}`}
					{:else}
						Resend email verification
					{/if}
				</Button>
				<Button on:click|once={handleHardReload}>
					if you have verify your email or it was a mistake, you can reload this page now!
					<div class="material-icons">replay</div>
				</Button>
			</div>
		{:else}
			<div class="mdc-typography--headline6 FlexContainer FlexContainer--Center">
				Email verified <div class="material-icons">check</div>
			</div>
		{/if}
	</Content>
</Paper>
