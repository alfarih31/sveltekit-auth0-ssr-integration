/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs#typescript
// for information about these interfaces

declare namespace App {
	interface Locals {
		authenticated: boolean;
		user?: User;
	}

	interface Platform {}

	interface Session {
		authenticated: boolean;
		user?: User;
	}

	interface Stuff {}
}
