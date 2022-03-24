import APPError from '$lib/modules/app-error';

const ERR_CODES = {
	ERR_API: 'ERR_API',
	ERR_FORBIDDEN: 'ERR_FORBIDDEN',
	ERR_UNAUTHORIZED: 'ERR_UNAUTHORIZED',
};

export const ERR_API = new APPError(ERR_CODES.ERR_API, { message: 'API error' });
export const ERR_FORBIDDEN = new APPError(ERR_CODES.ERR_FORBIDDEN, { message: 'forbidden' });
export const ERR_UNAUTHORIZED = new APPError(ERR_CODES.ERR_UNAUTHORIZED, {
	message: 'unauthorized',
});
