import type { Auth0Client } from '@auth0/auth0-spa-js';

export async function logout(c: Auth0Client) {
	return c.logout();
}
