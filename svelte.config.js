import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';
import { resolve } from 'path';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		scss: {
			includePaths: ['node_modules', 'src'],
		},
		postcss: {
			plugins: [autoprefixer],
		},
		sourceMap: dev,
	}),

	kit: {
		adapter: adapter(),
		vite: {
			resolve: {
				alias: {
					$assets: resolve('./src/assets'),
					'$assets/*': resolve('./src/assets/*'),
					$components: resolve('./src/components'),
					'$components/*': resolve('./src/components/*'),
					$configs: resolve('./src/configs'),
					'$configs/*': resolve('./src/configs/*'),
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
