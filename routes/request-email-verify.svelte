<script lang="ts">
	import Paper, { Content } from '@smui/paper';
	import Button from '@smui/button';
	import { showSnackbar } from '$lib/stores/actions';
	import { userState } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { logoutPath, homePath } from '$configs/client/route.config';

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

	const handleHardReload = async () => {
		await goto(logoutPath);
	};

	$: profile = $userState.profile;
</script>

{#if profile.id}
	<div class="mdc-typography--headline3" style="margin: 1rem">Verify Email</div>
	<Paper class="cms-dashboard__paper">
		<Content>
			{#if profile.provider === 'auth0'}
				{#if !profile.email_verified}
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
							if you have verify your email or it was a mistake, you can re-login now!
							<div class="material-icons">replay</div>
						</Button>
					</div>
				{:else}
					<div class="mdc-typography--headline6 FlexContainer FlexContainer--Center--Col">
						<span>
							Email verified <div class="material-icons" style="padding: 0">check</div>
						</span>
						<Button on:click|once={handleHardReload}>
							If you can't go to home, you can re-login now!
							<div class="material-icons" style="padding: 0">replay</div>
						</Button>
					</div>
				{/if}
			{:else}
				<div class="mdc-typography--headline6 FlexContainer FlexContainer--Center--Col">
					<span>
						Email verified <div class="material-icons" style="padding: 0">check</div>
					</span>
					<Button on:click|once={async () => await goto(homePath)}>
						Go to home now!
						<div class="material-icons" style="padding: 0">home</div>
					</Button>
				</div>
			{/if}
		</Content>
	</Paper>
{/if}
