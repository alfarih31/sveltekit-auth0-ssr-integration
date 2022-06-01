/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs#typescript
// for information about these interfaces

declare namespace App {
	interface Session {
		actor?: {
			userID: string;
			subjectID: number;
		};
		provider: string;
	}
}
