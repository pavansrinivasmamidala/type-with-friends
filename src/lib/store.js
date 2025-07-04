// @ts-nocheck
import { writable } from 'svelte/store';
import words from './words';
export const response = writable({});
import { v4 as uuidv4 } from 'uuid'; // Import the uuid library




export const nick = writable('');
export const socketId = writable('');
// export const wordsArray = derived(response, ($response) => {
//     if($response.content){
//         console.log($response.content.split('').join(''));
//         return $response.content.split('').join();
//     }
//     return [];
// })

export const letter = {
	text: '',
	isWrong: false,
	isTyped: false,
	isActive: false
};

export const word = {
	letters: [{}],
	isActive: false
};

export const wordsArray = [];

words.map((word) => {
	let lettersArray = [];

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
// Create a writable store for the player
export const player = writable({
	playerId: uuidv4(), // Generate a UUID for the player
	currentWordIndex: 0,
	socketID: '',
	isPartyLeader: false,
	WPM: -1,
	nickName: '',
	score: ''
});

// Function to update player data
function updatePlayer(data) {
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

export const game = writable({
	gameId: uuidv4(),
	words: [],
	isOpen: true,
	isOver: false,
	playerIds: [],
});