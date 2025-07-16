import ioClient, { Socket } from 'socket.io-client';
const ENDPOINT = "http://localhost:3001";
import { browserStorage } from './browser-storage';

let socket: Socket | undefined;
let isConnecting = false;
let currentSocketId = '';

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
      currentSocketId = socket?.id || '';
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
      currentSocketId = '';
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      isConnecting = false;
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      currentSocketId = socket?.id || '';
    });
  }
  return socket;
}

// Export the socket instance - ensure it's created
export const io = createSocket();

// Export a function to get the current socket ID
export function getCurrentSocketId(): string {
  return currentSocketId;
}

// Export a function to wait for socket connection
export function waitForSocketConnection(): Promise<string> {
  return new Promise((resolve) => {
    if (socket?.connected) {
      resolve(currentSocketId);
    } else {
      socket?.on('connect', () => {
        currentSocketId = socket?.id || '';
        resolve(currentSocketId);
        socket?.off('connect');
      });
    }
  });
}

// Utility function to inspect active socket listeners
export function getActiveListeners(): void {
  if (!socket) {
    console.log('No socket instance available');
    return;
  }

  console.log('=== ACTIVE SOCKET.IO LISTENERS ===');
  console.log('Socket ID:', socket.id);
  console.log('Connected:', socket.connected);
  
  // Access the internal listeners object
  const listeners = (socket as any)._callbacks || {};
  
  if (Object.keys(listeners).length === 0) {
    console.log('No active listeners found');
  } else {
    Object.keys(listeners).forEach(event => {
      const eventListeners = listeners[event];
      console.log(`📡 ${event}: ${eventListeners.length} listener(s)`);
      eventListeners.forEach((listener: any, index: number) => {
        console.log(`  ${index + 1}. ${listener.name || 'Anonymous function'}`);
      });
    });
  }
  console.log('==================================');
}

// Utility function to remove all listeners for a specific event
export function removeAllListeners(event: string): void {
  if (socket) {
    console.log(`Removing all listeners for event: ${event}`);
    socket.removeAllListeners(event);
  }
}

// Utility function to clear all listeners (use with caution)
export function clearAllListeners(): void {
  if (socket) {
    console.log('Clearing all socket listeners');
    socket.removeAllListeners();
  }
} 