<script lang="ts">
	import type { InferType } from 'yup';
	import * as yup from 'yup';
	import type { ValidatorConfig } from '@felte/validator-yup';
	import { validator } from '@felte/validator-yup';
	import Paper, { Content } from '@smui/paper';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import Button, { Icon, Label } from '@smui/button';
	import { showSnackbar } from '$lib/stores/actions';
	import { goto } from '$app/navigation';
	import InputField from '$components/InputField/InputField.svelte';
	import { createForm } from 'felte';
	import { reporter } from '@felte/reporter-svelte';
	import { login, register } from '$lib/services/api/internal-proxy/auth';
	import { homePath } from '$configs/client/route.config';
	import { webAuthClient } from '$lib/services/clients/parties/auth0';
	import { userState } from '$lib/stores';
	import CircularProgress from '@smui/circular-progress';
	import { getProfile } from '$lib/services/api/internal-proxy/user';

	userState.subscribe(() => {});
	let visibility = {
		password: {
			isVisible: false,
			inputType: 'password',
		},
	};

	let isLoading = false;

	const loginSchema = yup.object({
		email: yup
			.string()
			.email('Not a valid email address')
			.required('${label} is required')
			.label('Email'),
		password: yup
			.string()
			.min(8, '${label} must minimum 8 char length')
			.matches(
				/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
				'${label} must contain one lowercase, one uppercase, one digit, & one special char'
			)
			.required('${label} is required')
			.label('Password'),
	});

	const changeVisibility = (e: CustomEvent & { target: Element }) => {
		const { id } = e.target;

		visibility[id].isVisible = !visibility[id].isVisible;
		visibility[id].inputType = visibility[id].isVisible ? 'text' : 'password';
	};

	const { form, data, validate, isValid } = createForm<
		InferType<typeof loginSchema>,
		ValidatorConfig
	>({
		extend: [validator({ schema: loginSchema }), reporter],
		schema: loginSchema,
	});

	async function handleLogin() {
		isLoading = true;
		await validate();
		if (!$isValid) {
			isLoading = false;
			return;
		}

		try {
			const { email, password } = $data;
			// Login
			await login(email, password);

			// Get profile
			$userState.profile = await getProfile();

			// Goto home
			goto(homePath, { replaceState: true }).then(() => {
				showSnackbar('Logged in...', {
					severity: 'success',
				});
			});
		} catch (err) {
			showSnackbar(err.message, { severity: 'error' });
		} finally {
			isLoading = false;
		}
	}

	async function handleSignup() {
		isLoading = true;
		await validate();
		if (!$isValid) {
			isLoading = false;
			return;
		}

		try {
			const { email, password } = $data;
			await register({ email, password });

			$userState.profile = await getProfile();
			// Goto home
			goto(homePath, { replaceState: true }).then(() => {
				showSnackbar('Logged in...', {
					severity: 'success',
				});
			});
		} catch (err) {
			showSnackbar(err.message, { severity: 'error' });
		} finally {
			isLoading = false;
		}
	}

	const handleLoginWithGoogle = async () => {
		isLoading = true;
		webAuthClient.authorize({
			connection: 'google-oauth2',
			redirectUri: window.location.origin + '/api/auth/callback',
			responseType: 'code',
			responseMode: 'query',
			scope: 'offline_access profile openid email',
			nonce: 'nonce',
		});
		isLoading = false;
	};

	const handleLoginWithFacebook = async () => {
		isLoading = true;
		webAuthClient.authorize({
			connection: 'facebook',
			redirectUri: window.location.origin + '/api/auth/callback',
			responseType: 'code',
			responseMode: 'query',
			scope: 'offline_access profile openid email',
			nonce: 'nonce',
		});

		isLoading = false;
	};

	const renderGoogle = async () => {};
</script>

<div class="FlexContainer--Center">
	<Paper class="cms-dashboard__paper">
		<Content>
			<form use:form>
				<LayoutGrid style="padding: 0">
					<Cell span="12">
						<h5 style="margin: 0">Log in or Sign up</h5>
					</Cell>
					<Cell span="12">
						<InputField
							id="email"
							name="email"
							label="Email"
							variant="outlined"
							leadingIcon="person"
							required
							style="width: 100%;"
						/>
					</Cell>

					<Cell span="12">
						<InputField
							id="password"
							name="password"
							type={visibility.password.inputType}
							label="Password"
							variant="outlined"
							leadingIcon="key"
							trailingIcon={visibility.password.isVisible ? 'visibility' : 'visibility_off'}
							trailingAction={changeVisibility}
							errorName="username"
							style="width: 100%;"
						/>
					</Cell>
				</LayoutGrid>
			</form>
			<LayoutGrid style="padding: 0">
				<Cell span="6">
					<Button on:click={handleLogin} touch class="btn btn-primary" disabled={isLoading}>
						{#if isLoading}
							<CircularProgress
								class="white-circular"
								style="height: 24px; width: 24px; color: black"
								indeterminate
							/>
						{:else}
							Log in
						{/if}
					</Button>
				</Cell>
				<Cell span="6">
					<Button on:click={handleSignup} touch class="btn" variant="outlined" disabled={isLoading}>
						{#if isLoading}
							<CircularProgress style="height: 24px; width: 24px;" indeterminate />
						{:else}
							Sign up
						{/if}</Button
					>
				</Cell>
			</LayoutGrid>
			<LayoutGrid style="padding: 0">
				<Cell span="12">
					<Button
						on:click|once={handleLoginWithGoogle}
						touch
						class="btn btn-primary"
						disabled={isLoading}
					>
						{#if isLoading}
							<CircularProgress
								style="height: 24px; width: 24px;"
								indeterminate
								class="white-circular"
							/>
						{:else}
							<img
								class="mdc-button__icon"
								src="https://img.icons8.com/color/48/undefined/google-logo.png"
								height="18px"
								width="18px"
								rel="google-icon"
							/>
							<Label>Log in with Google</Label>
						{/if}
					</Button>
				</Cell>
				<Cell span="12">
					<Button
						on:click|once={handleLoginWithFacebook}
						touch
						class="btn btn-primary"
						disabled={isLoading}
					>
						{#if isLoading}
							<CircularProgress
								style="height: 24px; width: 24px;"
								indeterminate
								class="white-circular"
							/>
						{:else}
							<Icon class="material-icons">facebook</Icon>
							<Label>Log in with Facebook</Label>
						{/if}
					</Button>
				</Cell>
			</LayoutGrid>
		</Content>
	</Paper>
</div>

<style lang="scss">
	.google-icon {
		margin-left: 0;
		margin-right: 8px;
		display: inline-block;
		position: relative;
		vertical-align: top;
	}
</style>
