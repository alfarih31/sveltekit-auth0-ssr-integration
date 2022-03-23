/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs#typescript
// for information about these interfaces

declare namespace App {
	interface Locals {
		session?: Session;
	}

	interface Platform {}

	interface Session {
		authenticated: boolean;
		userID: number;
		role: number;
	}

	interface Stuff {}
}
