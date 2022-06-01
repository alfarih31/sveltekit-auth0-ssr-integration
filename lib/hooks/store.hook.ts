import type { Store } from '$dto/stores';
import { getUserInfo } from '$lib/services/api/by-request/auth0';

export const hydrate = async (req: Request): Promise<Partial<Store>> => {
	const s: Partial<Store> = {
		userState: {
			profile: await getUserInfo(req),
		},
	};

	return s;
};
