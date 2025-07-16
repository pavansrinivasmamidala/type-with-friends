// @ts-nocheck
import { writable, type Writable } from 'svelte/store';
import words from './words';

// Import the new stores
import { playerStore, gameStore, chatStore, connectionStore } from './stores';

// Typing-related interfaces and stores (keeping these here as they're UI-specific)
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

// Legacy socket ID store (keeping for backward compatibility)
export const socketId: Writable<string> = writable('');

// Legacy response store (keeping for backward compatibility)
export const response: Writable<Record<string, any>> = writable({});

// Legacy nick store (keeping for backward compatibility)
export const nick: Writable<string> = writable('pavan');

// Re-export the new stores
export { playerStore, gameStore, chatStore, connectionStore };

// Legacy exports for backward compatibility
export const player = playerStore;
export const game = gameStore;
export const messages = chatStore;

// Debug subscriptions (keeping for backward compatibility)
if (typeof window !== 'undefined') {
	chatStore.subscribe((msgs) => {
		console.log('Messages store updated:', msgs);
	});

	socketId.subscribe((id) => {
		console.log('Socket ID store updated:', id);
	});
}