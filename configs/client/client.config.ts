import { browser } from '$app/env';
import type { Configs } from '$dto/config';
import EnvParser from '$lib/modules/env-parser';

class ClientConfigs implements Configs.ClientConfigs {
	readonly AUTH0_DOMAIN: string;
	readonly AUTH0_CLIENT_ID: string;

	constructor() {
		// Use __PRELOADED_CLIENT_CONFIGS__ from window if on browser
		if (browser) {
			Object.assign(this, window.__PRELOADED_CLIENT_CONFIGS__);

			// Delete from window
			window.__PRELOADED_CLIENT_CONFIGS__ = undefined;
			return;
		}

		this.AUTH0_DOMAIN = EnvParser.getString('AUTH0_DOMAIN');
		this.AUTH0_CLIENT_ID = EnvParser.getString('AUTH0_CLIENT_ID');
	}
}

const clientConfigs = new ClientConfigs();
export default clientConfigs;
