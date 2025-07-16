import { writable, type Writable } from 'svelte/store';
import { io } from '../realtime';
import { goto } from '$app/navigation';
import type { Player } from './playerStore';

export interface Game {
	gameId?: string;
	words?: string[];
	isOpen?: boolean;
	isOver?: boolean;
	playerIds?: string[];
	players?: Player[];
	chat?: ChatMessage[];
	startTime?: Date;
	endTime?: Date;
}

export interface ChatMessage {
	playerId: string;
	playerNick?: string;
	message?: string;
	timestamp?: Date;
}

// Create a writable store for the game
const createGameStore = () => {
	const { subscribe, set, update } = writable<Game>({});

	// Set up socket listeners
	const setupSocketListeners = () => {
		// Listen for game creation
		io?.on('game-created', (data: Game) => {
			console.log('Game created:', data);
			set(data);
		});

		// Listen for joining a game
		io?.on('joined-game', (data: Game) => {
			console.log('Joined game:', data);
			set(data);
		});

		// Listen for player list updates
		io?.on('players', (players: Player[]) => {
			console.log('Players updated:', players);
			update((current) => ({
				...current,
				players: players
			}));
		});

		// Listen for new player joining
		io?.on('player-joined', (data: { playerId: string; playerNick: string }) => {
			console.log('New player joined:', data);
			update((current) => ({
				...current,
				playerIds: [...(current.playerIds || []), data.playerId]
			}));
		});

		// Listen for player leaving
		io?.on('player-left', (data: { playerId: string; playerNick: string; reason: string }) => {
			console.log('Player left:', data);
			update((current) => ({
				...current,
				playerIds: (current.playerIds || []).filter(id => id !== data.playerId)
			}));
		});

		// Listen for game deletion
		io?.on('game-deleted', (data: { gameId: string }) => {
			console.log('Game deleted:', data.gameId);
			set({});
			goto('/');
		});
	};

	// Initialize socket listeners
	setupSocketListeners();

	return {
		subscribe,
		set,
		update,
		// Abstracted methods
		createGame: (playerId: string) => {
			io?.emit('new-game', { playerId });
		},
		joinGame: (gameId: string, playerId: string) => {
			console.log('Joining game with player ID:', playerId);
			io?.emit('join-game', { gameId, playerId });
		},
		getPlayers: (gameId: string) => {
			io?.emit('get-players', { gameId });
		},
		leaveGame: (gameId: string, playerId: string) => {
			io?.emit('leave-game', { gameId, playerId });
		},
		cleanup: () => {
			io?.off('game-created');
			io?.off('joined-game');
			io?.off('players');
			io?.off('player-joined');
			io?.off('player-left');
			io?.off('game-deleted');
		}
	};
};

export const gameStore = createGameStore(); 