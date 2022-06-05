<script lang="ts">
	import type { InferType } from 'yup';
	import * as yup from 'yup';
	import type { ValidatorConfig } from '@felte/validator-yup';
	import { validator } from '@felte/validator-yup';
	import InputField from '$components/InputField/InputField.svelte';
	import Paper, { Content } from '@smui/paper';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import { createForm } from 'felte';
	import { reporter } from '@felte/reporter-svelte';
	import Button, { Label } from '@smui/button';
	import { userState } from '$lib/stores';
	import internalProxyClient from '$lib/services/clients/rest/internal-proxy';
	import { HTTP_METHOD } from '$lib/modules/http-client';
	import { goto } from '$app/navigation';
	import { loginPath } from '$configs/client/route.config';
	import { showSnackbar } from '$lib/stores/actions';
	import CircularProgress from '@smui/circular-progress';

	let visibility = {
		oldPassword: {
			isVisible: false,
			inputType: 'password',
		},
		newPassword: {
			isVisible: false,
			inputType: 'password',
		},
		confirmPassword: {
			isVisible: false,
			inputType: 'password',
		},
	};

	let isLoading = false;

	const resetPasswordSchema = yup.object({
		oldPassword: yup
			.string()
			.min(8, '${label} must minimum 8 char length')
			.matches(
				/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
				'${label} must contain one lowercase, one uppercase, one digit, & one special char'
			)
			.required('${label} is required')
			.label('Old password'),
		newPassword: yup
			.string()
			.min(8, '${label} must minimum 8 char length')
			.matches(
				/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
				'${label} must contain one lowercase, one uppercase, one digit, & one special char'
			)
			.required('${label} is required')
			.label('New password'),
		confirmPassword: yup
			.string()
			.oneOf([yup.ref('newPassword'), null], '${label} not match')
			.label('Confirm new password'),
	});

	const changeVisibility = (e: CustomEvent & { target: Element }) => {
		const { id } = e.target;

		visibility[id].isVisible = !visibility[id].isVisible;
		visibility[id].inputType = visibility[id].isVisible ? 'text' : 'password';
	};

	const handleResetPassword = async (fields) => {
		isLoading = true;
		const { oldPassword, newPassword } = fields;
		try {
			await internalProxyClient.handleRequest(HTTP_METHOD.PATCH, {
				path: '/auth/reset-password',
				data: {
					oldPassword,
					newPassword,
				},
			});

			await goto(loginPath).then(() => {
				showSnackbar('Reset password successfully, please re-login!', { severity: 'success' });
			});
		} catch (err) {
			showSnackbar(err.message, { severity: 'error' });
		} finally {
			isLoading = false;
		}
	};

	const { form } = createForm<InferType<typeof resetPasswordSchema>, ValidatorConfig>({
		onSubmit: handleResetPassword,
		extend: [validator({ schema: resetPasswordSchema }), reporter],
		schema: resetPasswordSchema,
	});
</script>

<div class="mdc-typography--headline3" style="margin: 1rem">Reset Password</div>

<Paper class="cms-dashboard__paper">
	<Content>
		{#if $userState.profile.provider !== 'auth0'}
			<div class="mdc-typography--headline6">
				Oops! you're not logged by email-password and can't reset your password
			</div>
		{:else}
			<form use:form>
				<LayoutGrid>
					<Cell span="12">
						<InputField
							id="oldPassword"
							name="oldPassword"
							label="Old password"
							variant="outlined"
							required
							style="width: 100%;"
							type={visibility.oldPassword.inputType}
							trailingIcon={visibility.oldPassword.isVisible ? 'visibility' : 'visibility_off'}
							trailingAction={changeVisibility}
						/>
					</Cell>
					<Cell span="12">
						<InputField
							id="newPassword"
							name="newPassword"
							label="New password"
							variant="outlined"
							required
							style="width: 100%;"
							type={visibility.newPassword.inputType}
							trailingIcon={visibility.newPassword.isVisible ? 'visibility' : 'visibility_off'}
							trailingAction={changeVisibility}
						/>
					</Cell>
					<Cell span="12">
						<InputField
							id="confirmPassword"
							name="confirmPassword"
							label="Confirm new password"
							variant="outlined"
							required
							style="width: 100%;"
							type={visibility.confirmPassword.inputType}
							trailingIcon={visibility.confirmPassword.isVisible ? 'visibility' : 'visibility_off'}
							trailingAction={changeVisibility}
						/>
					</Cell>
					<Cell span={12}>
						<Button type="submit" variant="outlined" touch class="btn" disabled={isLoading}>
							{#if isLoading}
								<CircularProgress style="height: 24px; width: 24px;" indeterminate />
							{:else}
								<Label>Reset password</Label>
							{/if}
						</Button>
					</Cell>
				</LayoutGrid>
			</form>
		{/if}
	</Content>
</Paper>
