import type { Configs } from '$dto/config';
import { goto } from '$app/navigation';
import { logoutPath } from '$configs/client/route.config';

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
		id: 'profile',
		title: 'Profile',
		type: 'item',
		linkTo: '/profile',
		icon: 'account_circle',
	},
	{
		id: 'reset-password',
		title: 'Reset Password',
		type: 'item',
		linkTo: '/reset-password',
		icon: 'lock_reset',
	},
	{
		id: 'logout',
		title: 'Logout',
		type: 'item',
		icon: '',
		onClick: async () => {
			await goto(logoutPath);
		},
	},
];

export default navigationConfig;
