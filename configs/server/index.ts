import EnvParser from '$lib/modules/env-parser';
import type { Configs } from '$dto/config';

class ServerConfigs implements Configs.ServerConfigs {
	readonly AUTH0_DOMAIN: string;
	readonly AUTH0_CLIENT_ID: string;
	readonly AUTH0_CLIENT_SECRET: string;

	constructor() {
		this.AUTH0_DOMAIN = EnvParser.getString('AUTH0_DOMAIN');
		this.AUTH0_CLIENT_ID = EnvParser.getString('AUTH0_CLIENT_ID');
		this.AUTH0_CLIENT_SECRET = EnvParser.getString('AUTH0_CLIENT_SECRET');
	}

	get clientConfigs(): Configs.ClientConfigs {
		return {
			AUTH0_DOMAIN: this.AUTH0_DOMAIN,
			AUTH0_CLIENT_ID: this.AUTH0_CLIENT_ID,
		};
	}
}

const serverConfigs = new ServerConfigs();
export default serverConfigs;
