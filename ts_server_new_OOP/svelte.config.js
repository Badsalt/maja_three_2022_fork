import adapter from '@sveltejs/adapter-node';

import preprocess from 'svelte-preprocess';

import { mdsvex } from "mdsvex";
/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
preprocess(),
mdsvex({extensions: ['.md', '.svx', '.svelte']})
	],

	kit: {
		adapter: adapter()
	}
};

export default config;