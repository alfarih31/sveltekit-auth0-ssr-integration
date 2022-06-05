<script lang="ts">
	import { userState } from '$lib/stores';
	import Paper, { Content } from '@smui/paper';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import IconButton from '@smui/icon-button';
	import InputField from '$components/InputField/InputField.svelte';
	import CircularProgress from '@smui/circular-progress';
	import { showSnackbar } from '$lib/stores/actions';
	import { updateProfile } from '$lib/services/api/internal-proxy/user';

	let isEdit = false;
	let isLoading = false;
	let profile = $userState.profile;

	const handleSubmit = async () => {
		isLoading = true;

		try {
			const res = await updateProfile({
				name: profile.name,
				nickname: profile.nickname,
				picture: profile.picture,
			});

			$userState.profile = res;
			isEdit = false;
		} catch (err) {
			showSnackbar(err.message, { severity: 'error' });
		} finally {
			isLoading = false;
		}
	};
</script>

<div class="mdc-typography--headline3" style="margin: 1rem">Profile</div>

<Paper class="cms-dashboard__paper">
	<Content>
		<LayoutGrid>
			<Cell span="4">
				<div class="mdc-typography--headline6">Name</div>
				<div class="mdc-typography--subtitle1 FlexContainer FlexContainer--MiddleLeft">
					<span>
						{#if isEdit}
							<InputField
								id="nickname"
								name="nickname"
								label="Name"
								variant="outlined"
								required
								style="width: 100%;"
								noLabel
								bind:value={profile.nickname}
								readonly={isLoading}
							/>
						{:else}
							{$userState.profile.nickname || ''}
						{/if}
					</span>
					{#if isEdit}
						<IconButton
							class="material-icons"
							style="padding: 0"
							disabled={isLoading}
							on:click={handleSubmit}
						>
							{#if isLoading}
								<CircularProgress style="height: 24px; width: 24px;" indeterminate />
							{:else}
								check
							{/if}
						</IconButton>
					{:else}
						<IconButton
							class="material-icons"
							style="padding: 0"
							on:click={() => {
								isEdit = true;
							}}>edit</IconButton
						>
					{/if}
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
