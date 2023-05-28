/* eslint-disable no-unused-vars */
import adapter from '@sveltejs/adapter-vercel';
// import adapter from '@sveltejs/adapter-auto';
import { Server } from 'socket.io';
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),

		// // Override http methods in the Todo forms
		// methodOverride: {
		// 	allowed: ['PATCH', 'DELETE']
		// }
	}
};

export default config;
