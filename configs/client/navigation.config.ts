import type { Configs } from '$dto/config';
import { goto } from '$app/navigation';
import { authenticateClient } from '$lib/services/clients/parties/auth0';

export const TYPE = {
	ITEM: 'item',
	GROUP: 'group',
};

const navigationConfig: Configs.NavigationConfig[] = [
	{
		id: 'home',
		title: 'Home',
		type: 'item',
		linkTo: '/',
		icon: 'home',
	},
	{
		id: 'users',
		title: 'Users',
		type: 'group',
		icon: 'supervised_user_circle',
		expanded: true,
		children: [
			{
				id: 'personal',
				title: 'Personal',
				type: 'item',
				icon: 'account_circle',
				linkTo: '/personal',
			},
			{
				id: 'groups',
				title: 'Groups',
				type: 'group',
				icon: 'group',
				children: [
					{
						id: 'group',
						title: 'Membership',
						type: 'item',
						icon: 'verified_user',
						linkTo: '/membership',
					},
				],
			},
		],
	},
	{
		id: 'secured-path',
		title: 'Secured Path',
		linkTo: '/secured-path',
		type: 'item',
		icon: 'verified_user',
	},
	{
		id: 'logout',
		title: 'Logout',
		type: 'item',
		icon: '',
		onClick: async () => {
			const url = authenticateClient.buildLogoutUrl({
				returnTo: window.location.origin + '/api/auth/logout',
			});
			await goto(url);
		},
	},
	{
		id: 'login',
		title: 'Login',
		type: 'item',
		icon: '',
		linkTo: '/login',
	},
];

export default navigationConfig;
