import { writable, type Writable } from 'svelte/store';
import { io } from '../realtime';

export interface ChatMessage {
	playerId: string;
	playerNick?: string;
	message?: string;
	timestamp?: Date;
}

// Create a writable store for chat messages
const createChatStore = () => {
	const { subscribe, set, update } = writable<ChatMessage[]>([]);

	// Set up socket listeners
	const setupSocketListeners = () => {
		// Listen for new messages
		io?.on('get-messages', (message: ChatMessage) => {
			console.log('Sending message received from server', message);
			console.log('New message received:', message);
			update((messages) => [...messages, message]);
		});

		// Listen for message history when joining a game
		io?.on('chat-history', (messages: ChatMessage[]) => {
			console.log('Chat history loaded:', messages);
			set(messages);
		});

		// Listen for message errors
		io?.on('message-error', (error: { message: string; code: string }) => {
			console.error('Message error:', error);
			// Could emit a toast notification here
		});
	};

	// Initialize socket listeners
	setupSocketListeners();

	return {
		subscribe,
		set,
		update,
		// Abstracted methods
		sendMessage: (gameId: string, playerId: string, playerNick: string, message: string) => {
			if (!message.trim()) return;

			const messageData = {
				gameId,
				playerId,
				playerNick,
				message: message.trim(),
				timestamp: new Date()
			};

			console.log('Sending message inside chatStore:', messageData);

			// Add message optimistically to the store immediately
			// update((messages) => [...messages, messageData]);

			// Emit message to server
			io?.emit('send-message', messageData);
		},
		loadChatHistory: (gameId: string) => {
			io?.emit('get-chat-history', { gameId });
		},
		clearMessages: () => {
			set([]);
		},
		cleanup: () => {
			io?.off('new-message');
			io?.off('chat-history');
			io?.off('message-error');
		}
	};
};

export const chatStore = createChatStore();
