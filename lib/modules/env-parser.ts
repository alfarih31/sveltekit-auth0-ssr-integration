export default class EnvParser {
	static get(key: string): any {
		if (typeof window !== 'undefined') {
			return undefined;
		}

		return process.env[key];
	}

	static getBool(key: string): boolean {
		const val = EnvParser.get(key);

		switch (val) {
			case 'true':
			case 'True':
			case 'TRUE':
			case '1':
				return true;
			default:
				return false;
		}
	}

	static getNumber(key: string): number {
		const val = EnvParser.get(key);

		if (!val) {
			return 0;
		}

		const nVal = parseInt(val, 10);
		if (isNaN(nVal)) {
			return 0;
		}

		return nVal;
	}

	static getString(key: string): string {
		const val = EnvParser.get(key);

		if (!val) {
			return '';
		}

		return val;
	}
}
