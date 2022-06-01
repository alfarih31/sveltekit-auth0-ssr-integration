import type { Authentication, WebAuth } from 'auth0-js';
import auth0 from 'auth0-js';
import serverConfigs from '$configs/server?server';
import clientConfigs from '$configs/client/client.config?client';
import { browser } from '$app/env';

let _authenticateClient: Authentication;
let _webAuthClient: WebAuth;

if (browser) {
	_webAuthClient = new auth0.WebAuth({
		domain: clientConfigs.AUTH0_DOMAIN,
		clientID: clientConfigs.AUTH0_CLIENT_ID,
	});
	_authenticateClient = _webAuthClient.client;
} else {
	_webAuthClient = new auth0.WebAuth({
		domain: serverConfigs.AUTH0_DOMAIN,
		clientID: serverConfigs.AUTH0_CLIENT_ID,
	});
	_authenticateClient = _webAuthClient.client;
}

export const authenticateClient = _authenticateClient;
export const webAuthClient = _webAuthClient;
