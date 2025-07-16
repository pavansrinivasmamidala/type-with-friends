import { writable, type Writable } from 'svelte/store';
import { browserStorage } from '../browser-storage';
import { io, waitForSocketConnection } from '../realtime';

export interface Player {
	playerId?: string;
	currentWordIndex?: number;
	socketId?: string;
	isPartyLeader?: boolean;
	WPM?: number;
	nickName?: string;
	score?: string;
}

// Create a writable store for the player with browser storage persistence
const createPlayerStore = () => {
	// Initialize with stored player data if available
	const storedPlayer = browserStorage.getPlayer();
	const { subscribe, set, update } = writable<Player>(storedPlayer || {});

	// Set up socket listeners
	const setupSocketListeners = () => {
		// Listen for new player creation
		io?.on('new-player', async (data: Player) => {
			console.log('New player created:', data);
			set(data); // This will automatically save to storage
		});

		// Listen for socket ID updates
		io?.on('socket-id-updated', (data: { playerId: string; socketId: string }) => {
			update((current) => {
				if (current.playerId === data.playerId) {
					return { ...current, socketId: data.socketId };
				}
				return current;
			});
		});
	};

	// Initialize socket listeners
	setupSocketListeners();

	return {
		subscribe,
		set: (value: Player) => {
			set(value);
			browserStorage.setPlayer(value);
		},
		update: (updater: (value: Player) => Player) => {
			update((current) => {
				const newValue = updater(current);
				browserStorage.setPlayer(newValue);
				return newValue;
			});
		},
		clear: () => {
			set({});
			browserStorage.clearPlayer();
		},
		updateField: (field: keyof Player, value: any) => {
			update((current) => {
				const newValue = { ...current, [field]: value };
				browserStorage.setPlayer(newValue);
				return newValue;
			});
		},
		// Abstracted methods
		createPlayer: async (isPartyLeader: boolean = false) => {
			const socketId = await waitForSocketConnection();
			io?.emit('new-player', {
				partyLeader: isPartyLeader,
				socketId: socketId
			});
		},
		updateSocketId: async (playerId: string) => {
			const socketId = await waitForSocketConnection();
			io?.emit('update-socket-id', {
				playerId: playerId,
				socketId: socketId
			});
		},
		cleanup: () => {
			io?.off('new-player');
			io?.off('socket-id-updated');
		}
	};
};

export const playerStore = createPlayerStore(); 