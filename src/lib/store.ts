// @ts-nocheck
import { writable, type Writable } from 'svelte/store';
import { browserStorage } from './browser-storage';
import words from './words';

interface Letter {
	text: string;
	isWrong: boolean;
	isTyped: boolean;
	isActive: boolean;
}

interface Word {
	letters: Letter[];
	isActive: boolean;
}

interface Player {
	currentWordIndex?: number;
	socketID?: string;
	isPartyLeader?: boolean;
	WPM?: number;
	nickName?: string;
	score?: string;
}

export const response: Writable<Record<string, any>> = writable({});
export const nick: Writable<string> = writable('pavan');
export const socketId: Writable<string> = writable('');
// export const wordsArray = derived(response, ($response) => {
//     if($response.content){
//         console.log($response.content.split('').join(''));
//         return $response.content.split('').join();
//     }
//     return [];
// })

export const letter: Letter = {
	text: '',
	isWrong: false,
	isTyped: false,
	isActive: false
};

export const word: Word = {
	letters: [{} as Letter],
	isActive: false
};

export const wordsArray: Word[] = [];

words.map((word) => {
	let lettersArray: Letter[] = [];

	word.split('').map((letter) => {
		lettersArray.push({
			text: letter,
			isWrong: false,
			isTyped: false,
			isActive: false
		});
	});
	wordsArray.push({
		letters: lettersArray,
		isActive: false
	});
});

// console.log(wordsArray);
// Create a writable store for the player with browser storage persistence
const createPlayerStore = () => {
	// Initialize with stored player data if available
	const storedPlayer = browserStorage.getPlayer();
	const { subscribe, set, update } = writable(storedPlayer || {});

	return {
		subscribe,
		set: (value: any) => {
			set(value);
			browserStorage.setPlayer(value);
		},
		update: (updater: (value: any) => any) => {
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
		// Add method to update specific field
		updateField: (field: string, value: any) => {
			update((current) => {
				const newValue = { ...current, [field]: value };
				browserStorage.setPlayer(newValue);
				return newValue;
			});
		}
	};
};

export const player = createPlayerStore();

// Function to update player data
function updatePlayer(data: Partial<Player>) {
	player.update((current) => {
		return { ...current, ...data };
	});
}

// Example function to set player data
export function setPlayerData() {
	updatePlayer({
		currentWordIndex: 1,
		socketID: 'abc123',
		isPartyLeader: true,
		WPM: 50,
		nickName: 'Player1',
		score: '100'
	});
}

export const game: Writable<Record<string, any>> = writable({});

export const messages = writable([]);

// Add a debug subscription to see if messages are being updated
if (typeof window !== 'undefined') {
	messages.subscribe((msgs) => {
		console.log('Messages store updated:', msgs);
	});
}

// Add debug subscription to track socket ID changes
if (typeof window !== 'undefined') {
	socketId.subscribe((id) => {
		console.log('Socket ID store updated:', id);
	});
}