import type { NavigationConfig } from '$lib/dto/config';

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
		linkTo: '/logout',
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
