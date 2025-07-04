import ioClient from 'socket.io-client';
const ENDPOINT = "http://localhost:3001";
import { socketId } from './store.js';

const socket = ioClient(ENDPOINT);

socket.on('connect', () => {
	console.log('connected to the server', socket.id);
	socketId.set(socket.id);
});

export const io = socket;