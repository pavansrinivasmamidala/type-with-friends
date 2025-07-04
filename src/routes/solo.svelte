<script>
	// @ts-nocheck
	import { wordsArray, response } from '../lib/store.js';
	import words from './solo/words.js';
	import Icon from 'svelte-awesome';
	import rotateRight from 'svelte-awesome/icons/rotateRight';
	import { nick } from '../lib/store.js';
	import { onDestroy } from 'svelte';


	let nickName = '';

	const unsub = nick.subscribe((value) => (nickName = value));

	onDestroy(unsub);

	let main = [];
	let index = 0;
	let counter = [];
	let timer = 0;
	let timerRunning = false;
	let isCompleted = false;
	let showStats = false;

	// creating a new array based on the words array
	// which includes spaces as a letter and each word
	// as a diff array
	let updatedWords = words.map((item) => {
		return [...item, ' '];
	});

	// mapping all the words inside a single array with each
	// letter and space as single characters
	updatedWords.map((word, idx) => {
		word.map((letter, i) => {
			main.push(letter);
		});
	});


	// checks if the entered character is a character or not
	function isCharALetter(char) {
		switch (char) {
			case 'Tab':
				return false;
			case 'Enter':
				return false;
			case 'Shift':
				return false;
			case 'Ctrl':
				return false;
			case 'Alt':
				return false;
			default:
				return true;
		}
	}

	// if a key is entered it needs to go through all the checks
	// before doing anything
	function handleKeydown(event) {
		console.log(wordsArray);

		// check these before starting the timer
		if (!timerRunning && isCharALetter(event.key) && !isCompleted) {
			timerRunning = true;
			startTimer();
		}

		// checking if the entered key is same as where the blink is
		if (event.key === main[index]) {
			console.log(main[index]);
			index++;
			if (event.key === ' ') {
				counter[index];
			}
		} else if (event.key === 'Backspace') {
			index > 0 ? index-- : null;
		} else {
			console.log(event.key);
		}

		// if the test is completed it will change the below values
		if (!isCompleted && index === main.length - 1) {
			isCompleted = true;
			timerRunning = false;
		}
	}

	// function to start the timer and logic for timer
	function startTimer() {
		setInterval(function () {
			if (timerRunning) timer++;
		}, 1000);
	}
</script>

<!-- svelte feature a window wide selector which calls the 
	function when a key is pressed in any part of the window-->
<svelte:window on:keydown={handleKeydown} />

<div class="container">
	<!-- show timer after the test starts-->
	<div>
		<span class:invisible={!timerRunning} class="timer">{timer}</span>
	</div>

	<!-- show the speed after the test completed -->
	{#if isCompleted}
		<div>
			<span class="speed"
				>{isCompleted ? `${Math.trunc(main.length / ((timer + 1) / 12))} WPM` : ''}</span
			>
		</div>
	{/if}
	<!-- div which displays the letters -->
	<div class="words">
		{#each main as letter, i}
			{#if i === index}
				<p id="blink" />
			{/if}
			{#if letter === ' '}
				<p>&nbsp;</p>
			{:else}
				<p class:selected={i < index} class="letter">{letter}</p>
			{/if}
		{/each}
	</div>

	<div>
		<button class="refresh" onclick="location.reload()">
			<Icon data={rotateRight} scale="1.5" style="color:var(--lightTextColor)" />
		</button>
	</div>

	<!-- <span class:info={isCompleted} class="invisible">Tab + Enter to restart</span> -->
</div>

<style>
	.container {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		flex-direction: column;
		max-width: 65vw;
		margin: auto;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
	}
	.words {
		margin-top: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
		word-wrap: break-word;
		flex-wrap: wrap;
		font-family: Georgia, 'Times New Roman', Times, serif;
		color: var(--darkBackground);
	}

	.selected {
		color: var(--lightTextColor);
	}

	.refresh {
		margin-top: 30px;
		border: none;
		background-color: white;
		padding: 5px;
		cursor: pointer;
		transition: 0.5s ease-in-out;
	}

	.refresh:focus-visible {
		outline: none;
		background-color: var(--darkBackground);
		border-radius: 10px;
		padding-bottom: 0px;
	}

	p {
		font-size: large;
		color: var(--darkBackground);
		margin: 11px 0px;
	}

	:global(body.dark-mode) p {
		color: white;
	}

	:global(body.dark-mode) .selected {
		color: var(--darkTextColor);
	}
	:global(body.dark-mode) .timer {
		color: white;
	}

	:global(body.dark-mode) .refresh {
		background-color: var(--darkBackground);
	}

	:global(body.dark-mode) .refresh:focus-visible {
		border: var(--darkTextColor);
	}

	#blink {
		position: relative;
		animation: blinkLight 1s infinite;
		height: 35px;
		width: 2px;
		background-color: var(--lightTextColor);
	}
	:global(body.dark-mode) #blink {
		animation: blinkDark 1s infinite;
	}

	.letter {
		font-size: 1.5rem;
		line-height: 1.4rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
	}

	@keyframes blinkLight {
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	@keyframes blinkDark {
		50% {
			background-color: var(--darkBackground);
		}
		100% {
			background-color: var(--lightTextColor);
		}
	}

	.invisible {
		visibility: hidden;
	}

	.speed {
		font-size: 30px;
		font-weight: 700;
		line-height: large;
		color: var(--lightTextColor);
	}

	.timer {
		font-size: 100px;
		line-height: 60px;
		color: var(--darkBackground);
	}

	.info {
		font-size: 13px;
		visibility: visible;
		margin-top: 20px;
	}
</style>
