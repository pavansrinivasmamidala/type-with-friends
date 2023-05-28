/* eslint-disable no-unused-vars */

import adapter from '@sveltejs/adapter-vercel';
// import adapter from '@sveltejs/adapter-auto';
import { Server } from 'socket.io';
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			runtime: 'nodejs18.x',
		  }),
	}
};

export default config;
