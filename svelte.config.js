import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';
import { resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		postcss: {
			plugins: [autoprefixer],
		},
		sourceMap: dev,
	}),

	kit: {
		adapter: adapter(),
		files: {
			assets: 'static',
			hooks: 'lib/hooks',
			lib: 'lib',
			routes: 'routes',
			serviceWorker: 'lib/service-worker',
			template: 'static/app.html',
		},
		vite: {
			server: {
				fs: {
					allow: ['configs'],
				},
			},
			resolve: {
				alias: {
					$components: resolve('./lib/components'),
					'$components/*': resolve('./lib/components/*'),
					$configs: resolve('./configs'),
					'$configs/*': resolve('./configs/*'),
				},
			},
		},
	},
	onwarn: (warning, handler) => {
		const { code } = warning;
		if (code === 'css-unused-selector') return;

		handler(warning);
	},
};

export default config;
