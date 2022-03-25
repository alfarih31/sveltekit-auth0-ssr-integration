import type { Store } from '$dto/stores';

export const hydrate = (req: Request): Partial<Store> => {
	const s: Partial<Store> = {};

	return s;
};
