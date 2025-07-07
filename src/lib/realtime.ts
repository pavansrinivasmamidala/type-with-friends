import ioClient, { Socket } from 'socket.io-client';
const ENDPOINT = "http://localhost:3001";
import { socketId } from './store';
import { browserStorage } from './browser-storage';

let socket: Socket | undefined;
let isConnecting = false;

// Create socket connection once - make it truly singleton
function createSocket() {
  if (!socket && !isConnecting) {
    isConnecting = true;
    console.log('Creating new socket connection...');
    socket = ioClient(ENDPOINT, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      forceNew: false // Prevent multiple connections
    });

    socket.on('connect', () => {
      console.log('Socket connected with ID:', socket?.id);
      socketId.set(socket?.id || '');
      isConnecting = false;
      
      // Update socket ID in stored player data
      const storedPlayer = browserStorage.getPlayer();
      if (storedPlayer && storedPlayer.playerId) {
        console.log('Updating socket ID in stored player data');
        const updatedPlayer = browserStorage.updatePlayerField('socketId', socket?.id);
        if (updatedPlayer) {
          console.log('Updated player data with new socket ID:', updatedPlayer);
        }
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      socketId.set('');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      isConnecting = false;
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      socketId.set(socket?.id || '');
    });
  }
  return socket;
}

// Export the socket instance - ensure it's created
export const io = createSocket();

// Export a function to get the current socket ID
export function getCurrentSocketId(): string {
  return socket?.id || '';
}

// Export a function to wait for socket connection
export function waitForSocketConnection(): Promise<string> {
  return new Promise((resolve) => {
    if (socket?.connected) {
      resolve(socket.id);
    } else {
      socket?.on('connect', () => {
        resolve(socket.id);
      });
    }
  });
} 