import { sign, SignOptions, verify } from 'jsonwebtoken';
import type { AuthDTO } from '$dto/auth';
import APPError from '$lib/modules/app-error';
import DateUtils from './date-utils';

export default class Jwt {
	static verify = (payload: AuthDTO.JWTVerify, key: string) => {
		const { token, audience, subject, issuer } = payload;
		try {
			const tokenPayload = verify(token, key, {
				audience,
				subject,
				issuer,
			});
			return tokenPayload as AuthDTO.TokenPayload;
		} catch (err) {
			switch (err.name) {
				case 'JsonWebTokenError': {
					const errType = err.message;

					if (errType.includes('jwt audience invalid')) {
						throw new APPError('ERR_AUTH_SESSION', {
							message: `Audience invalid: ${audience}`,
						});
					} else if (errType.includes('jwt subject invalid')) {
						throw new APPError('ERR_AUTH_SESSION', { message: `Subject invalid` });
					} else if (errType === 'jwt malformed') {
						throw new APPError('ERR_AUTH_SESSION', { message: 'Token malformed' });
					}
					break;
				}
				case 'TokenExpiredError': {
					throw new APPError('ERR_EXPIRED_SESSION');
				}
			}

			throw new APPError('ERR_UNAUTHORIZED', { message: err.message });
		}
	};

	static sign = (payload: AuthDTO.JWTSign, key: string): AuthDTO.SignedToken => {
		const { createdAt, audience, lifetime, sessionID, subjectID, issuer } = payload;
		const signOptions: SignOptions = {
			algorithm: 'HS256',
			issuer,
			jwtid: sessionID,
			subject: `${subjectID}`,
			audience,
		};

		const expiredAt = DateUtils.addSecond(createdAt, lifetime);
		const exp = DateUtils.toEpoch(expiredAt);

		const jwtPayload = {
			exp,
		};

		const token = sign(jwtPayload, key, signOptions);
		return {
			token,
			expiredAt: exp,
		};
	};
}
