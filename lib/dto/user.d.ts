declare namespace User {
	interface Profile {
		id: string;
		name: string;
		nickname: string;
		email: string;
		email_verified: boolean;
		provider: string;
	}
}
