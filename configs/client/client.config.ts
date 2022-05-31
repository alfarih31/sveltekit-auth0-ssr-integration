import { browser } from '$app/env';
import type { Configs } from '$dto/config';

class ClientConfigs implements Configs.ClientConfigs {
	constructor() {
		// Use __PRELOADED_CLIENT_CONFIGS__ from window if on browser
		if (browser) {
			Object.assign(this, window.__PRELOADED_CLIENT_CONFIGS__);

			// Delete from window
			window.__PRELOADED_CLIENT_CONFIGS__ = undefined;
			return;
		}
	}
}

const clientConfigs = new ClientConfigs();
export default clientConfigs;
