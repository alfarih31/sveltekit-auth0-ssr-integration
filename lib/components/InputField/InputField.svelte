<script lang="ts">
	import { createField } from 'felte';
	import type { InputComponentDev } from '@smui/textfield';
	import type { FloatingLabelComponentDev } from '@smui/floating-label';
	import type { NotchedOutlineComponentDev } from '@smui/notched-outline';
	import type { LineRippleComponentDev } from '@smui/line-ripple';
	import type { Instance as TippyInstance, Props } from 'tippy.js';
	import FloatingLabel from '@smui/floating-label';
	import NotchedOutline from '@smui/notched-outline';
	import LineRipple from '@smui/line-ripple';
	import TextField, { Input, Textarea } from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import IMask from 'imask';
	import { onMount } from 'svelte';
	import { ValidationMessage } from '@felte/reporter-svelte';
	import Icon from '@smui/textfield/icon';
	import tippy from 'tippy.js';
	import 'tippy.js/dist/tippy.css';

	let customInput: InputComponentDev;
	let customFloatingLabel: FloatingLabelComponentDev;
	let customLineRipple: LineRippleComponentDev;
	let customNotched: NotchedOutlineComponentDev;
	let validation: HTMLElement;

	export let id = '';
	export let name = '';
	export let type: 'text' | 'textarea' | 'number' | 'tel' | 'date' = 'text';
	export let value = '';
	export let label = '';
	export let noLabel = false;
	export let readonly = false;

	export let helperText: string = '';
	export let required: boolean = false;
	export let invalid: boolean = false;
	export let complete: Function = null;

	export let leadingIcon: string = '';
	export let trailingIcon: string = '';
	export let variant: 'filled' | 'outlined' | 'standard' = 'standard';
	export let style: string = '';

	export let leadingAction: any = null;
	export let trailingAction: any = null;
	let tippyInstance: TippyInstance<Props>;
	let errorMessage = '';

	const { onInput } = createField(id);

	$: {
		onInput(value);
	}
	const options = {
		tel: {
			mask: '+62-0000000000000',
		},
	};

	function onError(message) {
		errorMessage = message;
		if (!message) {
			if (tippyInstance) {
				tippyInstance.disable();
			}
			invalid = false;
			return '';
		}

		tippyInstance.setContent(message);
		tippyInstance.enable();
		invalid = true;

		return '';
	}

	onMount(() => {
		if (type === 'tel') {
			const elem = customInput.getElement() as HTMLElement;
			IMask(elem, options.tel);
		}

		tippyInstance = tippy(`#input-${id}`)[0];
		tippyInstance.disable();
	});

	const onFocus = () => {
		if (errorMessage) {
			tippyInstance.enable();
			tippyInstance.show();
		}
	};
</script>

<!--  Use this if theres any consent about change MSISDN country code
	<MenuSurface bind:this={surface} anchorCorner="BOTTOM_LEFT" style="right: 0;">
		<CountryCodeList isSelected="" actionSelect={() => {}} />
	</MenuSurface>
-->

<TextField
	bind:input={customInput}
	bind:floatingLabel={customFloatingLabel}
	bind:notchedOutline={customNotched}
	bind:lineRipple={customLineRipple}
	textarea={type === 'textarea'}
	{type}
	{invalid}
	{style}
	{variant}
>
	{#if variant === 'outlined'}
		<NotchedOutline bind:this={customNotched} slot="label">
			{#if !noLabel}
				<FloatingLabel bind:this={customFloatingLabel} for={id}>
					{label}
				</FloatingLabel>
			{/if}
		</NotchedOutline>
	{:else}
		<FloatingLabel bind:this={customFloatingLabel} for={id} slot="label">
			{label}
		</FloatingLabel>
		<LineRipple bind:this={customLineRipple} slot="ripple" />
	{/if}

	<svelte:fragment slot="leadingIcon">
		{#if type === 'tel'}
			<!--			&lt;!&ndash; Use This if theres any consent about change MSISDN country code-->
			<!--	         <span-->
			<!--	          {id}-->
			<!--	          role="button"-->
			<!--	          tabindex={1}-->
			<!--	          on:click={() => surface.setOpen(true)}-->
			<!--	          style="font-size: 20px; font-style: normal; background-color: #e4e4e4;"-->
			<!--	          class="material-icon mdc-text-field__icon mdc-text-field__icon&#45;&#45;leading fi fi-{countryCode.toLocaleLowerCase()}"-->
			<!--	        /> &ndash;&gt;-->
			<span
				{id}
				tabindex={-1}
				style="font-size: 20px; font-style: normal; background-color: #e4e4e4;"
				class="material-icon mdc-text-field__icon mdc-text-field__icon--leading fi fi-id"
			/>
		{/if}
		<Icon class="material-icons" tabindex={leadingAction !== null ? 1 : -1}>{leadingIcon}</Icon>
	</svelte:fragment>

	{#if type === 'textarea'}
		<Textarea
			id="input-{id}"
			{name}
			{variant}
			{required}
			disabled={readonly}
			bind:value
			bind:this={customInput}
			on:complete={complete}
			aria-controls="helper-{id}"
			aria-describedby="helper-{id}"
		/>
	{:else}
		<Input
			id="input-{id}"
			{name}
			{variant}
			{required}
			{type}
			disabled={readonly}
			bind:value
			bind:this={customInput}
			on:complete={complete}
			on:focus={onFocus}
			on:blur={tippyInstance.disable}
			aria-controls="helper-{id}"
			aria-describedby="helper-{id}"
		/>
	{/if}

	<svelte:fragment slot="trailingIcon">
		<i
			{id}
			class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing"
			tabindex={trailingAction !== null ? 1 : -1}
			on:click={trailingAction}
		>
			{trailingIcon}
		</i>
	</svelte:fragment>

	{#if helperText}
		<HelperText id="helper-{id}" slot="helper">{helperText}</HelperText>
	{/if}
</TextField>

<ValidationMessage for={id} bind:element={validation} let:messages={message}>
	<span id="validation-{id}" class="validation-message" aria-live="polite">
		{onError(message)}
	</span>
	<span slot="placeholder" id="validation-placeholder-{id}" class="validation-message">
		{onError(message)}
	</span>
</ValidationMessage>

<style lang="scss">
	.validation-message {
		color: var(--mdc-theme-error, #b71c1c);
	}
</style>
