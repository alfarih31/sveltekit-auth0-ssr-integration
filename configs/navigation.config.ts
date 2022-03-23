import type { NavigationConfig } from '$dto/config';
import { USER_ROLE } from '$lib/CONSTANTS';
import { showSnackbar } from '$lib/stores/actions';
import { logout } from '$lib/services/api/auth';
import { goto } from '$app/navigation';
import { loginPath } from '$configs/route.config';
import { browser } from '$app/env';

export const TYPE = {
	ITEM: 'item',
	GROUP: 'group',
};

const navigationConfig: NavigationConfig[] = [
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
				permissions: [USER_ROLE.PERSONAL],
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
			await logout();

			if (browser) {
				goto(loginPath, { replaceState: true }).then(() => {
					showSnackbar('Logged out...');
				});
			}
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
