export namespace AuthDTO {
	export interface Login {
		email: string;
		password: string;
	}

	export interface JWTSign {
		createdAt: Date;
		lifetime: number;
		subjectID: number;
		audience: string | string[];
		sessionID: string;
		issuer?: string;
	}

	export interface JWTVerify {
		token: string;
		audience: string | string[];
		issuer?: string;
		subject?: string;
	}

	export interface TokenPayload {
		sub: string;
		jti: string;
		exp: number;
		aud: string | string[];
	}

	export interface SignedToken {
		token: string;
		expiredAt: number;
	}
}
