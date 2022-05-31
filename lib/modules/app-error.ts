export default class APPError extends Error {
	code;

	source;

	metadata;

	constructor(
		code: string,
		options: { message?: string; source?: unknown; metadata?: unknown } = {}
	) {
		const { message, source, metadata } = options;
		super(message || '');

		Object.setPrototypeOf(this, new.target.prototype);

		this.name = 'APPError';
		this.code = code;
		this.source = source;
		this.metadata = metadata;
	}

	compose({
		code,
		message,
		source,
		metadata,
	}: {
		code?: string;
		message?: string;
		source?: unknown;
		metadata?: unknown;
	}): APPError {
		return new APPError(code || this.code, {
			message: message || this.message,
			metadata: metadata || this.metadata,
			source: source || this.source,
		});
	}
}
