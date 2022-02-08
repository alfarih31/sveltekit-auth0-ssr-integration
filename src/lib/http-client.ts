import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import APPError, { throwError } from './app-error';

type HandlerArgs = {
	path: string;
	overrideBaseUrl?: string;
	data?: unknown;
	config?: AxiosRequestConfig;
	useLocal?: boolean;
};

type ClientConfigArgs = {
	baseURL?: string;
	basePath?: string;
	defaultHeaders?: { [key: string]: string | number };
};

type HandlerFunc = <T>(args: HandlerArgs) => Promise<AxiosResponse<T>>;

interface IHTTPClient {
	handleRequest: <T>(method: HTTP_METHOD, options: HandlerArgs) => Promise<AxiosResponse<T>>;
	setAuthToken: (method: AUTH_METHOD, authorization: string) => void;
	removeAuthToken: () => void;
	checkAuthorization: () => { method: AUTH_METHOD | undefined; isSet: boolean };
}

export enum HTTP_METHOD {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE',
	PATCH = 'PATCH',
}

export enum AUTH_METHOD {
	BLANK = 'BLANK',
	BASIC = 'BASIC',
	BEARER = 'BEARER',
}

const ERR_CODE = 'API_ERR';

class AuthStorage {
	private _token?: string;
	private _method?: AUTH_METHOD;

	public set token(value: string | undefined) {
		this._token = value;
	}

	public get method(): AUTH_METHOD | undefined {
		return this._method;
	}

	public set method(value: AUTH_METHOD | undefined) {
		this._method = value;
	}

	public get authorization(): string | undefined {
		if (!this._method || !this._token) {
			return undefined;
		}

		switch (this._method.toUpperCase()) {
			case AUTH_METHOD.BLANK:
				return this._token;
			case AUTH_METHOD.BEARER:
				return `Bearer ${this._token}`;
			case AUTH_METHOD.BASIC:
				return `Basic ${this._token}`;
			default:
				return undefined;
		}
	}

	public get authorizationConfig(): { method: AUTH_METHOD | undefined; isSet: boolean } {
		return {
			method: this._method,
			isSet: this._method !== undefined && this._token !== undefined,
		};
	}
}

export default class HTTPClient implements IHTTPClient {
	private client!: AxiosInstance;
	private readonly authStorage: AuthStorage = new AuthStorage();

	readonly HTTP_HANDLERS: { [k: string]: HandlerFunc } = {
		[HTTP_METHOD.GET]: <T>(args: HandlerArgs): Promise<AxiosResponse<T>> => {
			const { data = {} } = args;
			return this.client.get<T>(
				args.useLocal ? `${process.env.PUBLIC_URL}${args.path}` : args.overrideBaseUrl || args.path,
				{
					params: data,
					...args.config,
				}
			);
		},
		[HTTP_METHOD.POST]: <T>(args: HandlerArgs): Promise<AxiosResponse<T>> => {
			const { data = {} } = args;
			return this.client.post<T>(
				args.useLocal ? `${process.env.PUBLIC_URL}${args.path}` : args.overrideBaseUrl || args.path,
				data,
				args.config
			);
		},
		[HTTP_METHOD.PUT]: <T>(args: HandlerArgs): Promise<AxiosResponse<T>> => {
			const { data = {} } = args;
			return this.client.put<T>(
				args.useLocal ? `${process.env.PUBLIC_URL}${args.path}` : args.overrideBaseUrl || args.path,
				data,
				args.config
			);
		},
		[HTTP_METHOD.DELETE]: <T>(args: HandlerArgs): Promise<AxiosResponse<T>> => {
			const { data = {} } = args;
			return this.client.delete(
				args.useLocal ? `${process.env.PUBLIC_URL}${args.path}` : args.overrideBaseUrl || args.path,
				{
					params: data,
					...args.config,
				}
			);
		},
		[HTTP_METHOD.PATCH]: <T>(args: HandlerArgs): Promise<AxiosResponse<T>> => {
			const { data = {} } = args;
			return this.client.patch<T>(
				args.useLocal ? `${process.env.PUBLIC_URL}${args.path}` : args.overrideBaseUrl || args.path,
				data,
				args.config
			);
		},
	};

	constructor(args: ClientConfigArgs = { baseURL: '', basePath: '', defaultHeaders: {} }) {
		const { baseURL, basePath, defaultHeaders } = args;

		this.client = axios.create({
			baseURL: `${baseURL}${basePath}`,
			headers: defaultHeaders,
		});

		this.client.interceptors.request.use((config) => {
			if (this.authStorage.authorization) {
				config.headers.authorization = this.authStorage.authorization;
			}

			return config;
		});
	}

	async handleRequest<T>(method: HTTP_METHOD, options: HandlerArgs): Promise<AxiosResponse<T>> {
		try {
			// Override baseURL if not defined to window.location.origin
			if (!this.client.defaults.baseURL) {
				if (window) {
					this.client.defaults.baseURL = window.location.origin;
				}
			}

			const handler = this.HTTP_HANDLERS[method];
			if (!handler) {
				throwError('Method not implemented', { code: ERR_CODE });
			}

			return await handler<T>(options);
		} catch (err: any) {
			const { response } = err;

			if (response) {
				if (response.status === 401) {
					this.removeAuthToken();
				}
				err.message = response.data.message;
			}

			throw new APPError(ERR_CODE, { message: err.message });
		}
	}

	setAuthToken(method: AUTH_METHOD, token: string): void {
		this.authStorage.token = token;
		this.authStorage.method = method;
	}

	removeAuthToken(): void {
		this.authStorage.token = undefined;
		this.authStorage.method = undefined;
	}

	checkAuthorization(): { method: AUTH_METHOD | undefined; isSet: boolean } {
		return this.authStorage.authorizationConfig;
	}
}
