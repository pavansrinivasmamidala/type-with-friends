/* eslint-disable no-unused-vars */
import { sveltekit } from '@sveltejs/kit/vite';
import { Server } from 'socket.io';
/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(),
		{
			name: 'sveltekit-socket-io',
			configureServer(server) {
				const io = new Server(server.httpServer);

				// Socket.IO stuff goes here                

				console.log('SocketIO injected');
			}
		}]
};

export default config;
