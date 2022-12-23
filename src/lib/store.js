// @ts-nocheck
import { writable } from 'svelte/store';
import words from './words';
export const response = writable({});




export const nick = writable('');
export const player = writable({});
export const game = writable({});

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
