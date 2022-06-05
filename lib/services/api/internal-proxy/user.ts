import internalProxyClient from '$lib/services/clients/rest/internal-proxy';
import { HTTP_METHOD } from '$lib/modules/http-client';
import Profile = User.Profile;

export const getProfile = async (): Promise<Profile> => {
	const res = await internalProxyClient.handleRequest<Profile>(HTTP_METHOD.GET, {
		path: '/profile',
	});

	return res.data;
};

export const updateProfile = async (
	data: Partial<Omit<Profile, 'id' | 'email' | 'email_verified' | 'provider'>>
): Promise<Profile> => {
	const res = await internalProxyClient.handleRequest<Profile>(HTTP_METHOD.PATCH, {
		path: '/profile',
		data,
	});

	return res.data;
};
