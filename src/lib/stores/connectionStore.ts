import { writable, derived } from 'svelte/store';
import { io } from '../realtime';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface ConnectionState {
	status: ConnectionStatus;
	pingTime: number;
	lastPingTime: number;
	errorMessage?: string;
}

// Create a writable store for connection status
const createConnectionStore = () => {
	const connectionState = writable<ConnectionState>({
		status: 'connecting',
		pingTime: 0,
		lastPingTime: 0
	});

	const { subscribe, set, update } = connectionState;

	let pingInterval: NodeJS.Timeout | null = null;
	let pingStartTime = 0;

	// Set up socket listeners
	const setupSocketListeners = () => {
		// Listen for connection events
		io?.on('connect', () => {
			console.log('Socket connected');
			update((state) => ({
				...state,
				status: 'connected',
				errorMessage: undefined
			}));
		});

		io?.on('disconnect', () => {
			console.log('Socket disconnected');
			update((state) => ({
				...state,
				status: 'disconnected'
			}));
		});

		io?.on('connect_error', (error) => {
			console.error('Socket connection error:', error);
			update((state) => ({
				...state,
				status: 'error',
				errorMessage: error.message
			}));
		});

		io?.on('reconnect', (attemptNumber) => {
			console.log('Socket reconnected after', attemptNumber, 'attempts');
			update((state) => ({
				...state,
				status: 'connected',
				errorMessage: undefined
			}));
		});

		// Listen for pong response
		io?.on('pong', () => {
			const currentTime = Date.now();
			const ping = currentTime - pingStartTime;
			update((state) => ({
				...state,
				pingTime: ping,
				lastPingTime: currentTime
			}));
		});
	};

	// Start ping interval
	const startPingInterval = () => {
		if (pingInterval) {
			clearInterval(pingInterval);
		}

		pingInterval = setInterval(() => {
			if (io?.connected) {
				pingStartTime = Date.now();
				io?.emit('ping', {
					timestamp: pingStartTime
				});
			}
		}, 15000); // Send ping every 15 seconds
	};

	// Initialize socket listeners and ping
	setupSocketListeners();
	startPingInterval();

	// Derived stores for computed values
	const statusColor = derived(connectionState, ($state: ConnectionState) => {
		console.log('statusColor derived store', $state);
		switch ($state.status) {
			case 'connected':
				return $state.pingTime < 100 ? '#4CAF50' : $state.pingTime < 300 ? '#FF9800' : '#F44336';
			case 'connecting':
				return '#FF9800';
			case 'disconnected':
			case 'error':
				return '#F44336';
			default:
				return '#9E9E9E';
		}
	});

	const statusText = derived(connectionState, ($state: ConnectionState) => {
		switch ($state.status) {
			case 'connected':
				return $state.pingTime > 0 ? `${$state.pingTime}ms` : 'Connected';
			case 'connecting':
				return 'Connecting...';
			case 'disconnected':
				return 'Disconnected';
			case 'error':
				return 'Connection Error';
			default:
				return 'Unknown';
		}
	});

	const signalStrength = derived(connectionState, ($state: ConnectionState) => {
		if ($state.status !== 'connected') return 0;
		if ($state.pingTime === 0) return 3; // Default to good signal if no ping yet
		if ($state.pingTime < 100) return 4; // Excellent
		if ($state.pingTime < 200) return 3; // Good
		if ($state.pingTime < 500) return 2; // Fair
		return 1; // Poor
	});

	return {
		subscribe,
		statusColor,
		statusText,
		signalStrength,
		// Abstracted methods
		startPing: () => {
			startPingInterval();
		},
		stopPing: () => {
			if (pingInterval) {
				clearInterval(pingInterval);
				pingInterval = null;
			}
		},
		sendPing: () => {
			if (io?.connected) {
				pingStartTime = Date.now();
				io?.emit('ping', {
					timestamp: pingStartTime
				});
			}
		},
		cleanup: () => {
			if (pingInterval) {
				clearInterval(pingInterval);
				pingInterval = null;
			}
			io?.off('connect');
			io?.off('disconnect');
			io?.off('connect_error');
			io?.off('reconnect');
			io?.off('pong');
		}
	};
};

export const connectionStore = createConnectionStore();
export const { statusColor, statusText, signalStrength } = connectionStore; 