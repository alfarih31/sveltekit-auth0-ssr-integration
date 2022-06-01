import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { ERR_API } from '$lib';

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
}

export enum HTTP_METHOD {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE',
	PATCH = 'PATCH',
}

export default class HTTPClient implements IHTTPClient {
	private client!: AxiosInstance;

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
				throw ERR_API.compose({ message: 'method not implemented' });
			}

			return await handler<T>(options);
		} catch (err: any) {
			const { response } = err;

			if (response) {
				if (response.status === 401) {
					// TODO: handle on status 401
				}
				err.message = response.data?.message || err.message;
			}

			throw ERR_API.compose({ message: err.message });
		}
	}
}
