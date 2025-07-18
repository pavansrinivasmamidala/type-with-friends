<script>
	// @ts-nocheck
	import { wordsArray, response } from '$lib/store';
	import words from './words.js';
	import Icon from 'svelte-awesome';
	import rotateRight from 'svelte-awesome/icons/rotateRight';
	import { playerStore } from '$lib/store';
	import { onDestroy } from 'svelte';

	let nickName = '';

	const unsub = playerStore.subscribe((player) => {
		nickName = player.nickName || '';
	});

	onDestroy(unsub);

	let main = [];
	let index = 0;
	let counter = [];
	let timer = 0;
	let timerRunning = false;
	let isCompleted = false;
	let showStats = false;
	let refreshButton; // Add this reference

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

		// Handle Tab key to focus on restart button
		if (event.key === 'Tab') {
			event.preventDefault(); // Prevent default Tab behavior
			if (refreshButton) {
				refreshButton.focus();
			}
			return;
		}

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

<!-- svelte feature a window vide selector which calls the 
	function when a key is pressed in any part of the window-->
<svelte:window on:keydown={handleKeydown} />

<div class="container">
	<!-- show timer after the test starts-->
	<div>
		<span class:invisible={!timerRunning} class="timer">{timer}</span>
	</div>

	<div class:invisible={timerRunning || isCompleted}>
		<span class="start-text"
			>Start typing whenever you're ready <span class="pulse-1">•</span><span class="pulse-2"
				>•</span
			><span class="pulse-3">•</span>
		</span>
	</div>

	<!-- show the speed after the test completed -->
	{#if isCompleted}
		<div>
			<span class="speed">{`${Math.trunc(main.length / ((timer + 1) / 12))} WPM`}</span>
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

	<!-- on-screen keyboard replica -->
	<div class="keyboard">
		<div class="row first">
			{#each ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'] as key}
				<span class="key" class:highlight={key === main[index]}>{key}</span>
			{/each}
		</div>
		<div class="row second">
			{#each ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '"'] as key}
				<span class="key" class:highlight={key === main[index]}>{key}</span>
			{/each}
		</div>
		<div class="row third">
			{#each ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'] as key}
				<span class="key" class:highlight={key === main[index]}>{key}</span>
			{/each}
		</div>
		<div class="row space-row">
			<span class="key space" class:highlight={main[index] === ' '}>qwerty</span>
		</div>
	</div>

	<div>
		<button
			data-tooltip="Click to Restart"
			bind:this={refreshButton}
			class="refresh"
			onclick="location.reload()"
		>
			<Icon data={rotateRight} scale="1.5" style="color:var(--lightTextColor)" />
		</button>
	</div>

	<div class="info">
		<span class="tab-key">Tab</span> + <span class="enter-key">Enter</span> to restart
	</div>
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
		margin-top: 10px;
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
		cursor: pointer;
		transition: 0.5s ease-in-out;
		border-radius: 10px;
		padding-top: 5px;
	}

	.refresh:focus-visible {
		outline: none;
		background-color: var(--darkBackground);
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
		font-size: 32px;
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

	.start-text {
		font-size: 1.5rem;
		font-weight: 300;
		color: var(--lightTextColor);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.pulse-1 {
		animation: pulse-1 2s infinite;
		font-size: 2rem;
		color: var(--lightTextColor);
	}

	.pulse-2 {
		animation: pulse-2 2s infinite;
		font-size: 2rem;
		color: var(--lightTextColor);
	}

	.pulse-3 {
		animation: pulse-3 2s infinite;
		font-size: 2rem;
		color: var(--lightTextColor);
	}

	@keyframes pulse-1 {
		0%,
		100% {
			opacity: 0;
		}
		33% {
			opacity: 1;
		}
		66% {
			opacity: 0;
		}
	}

	@keyframes pulse-2 {
		0%,
		33% {
			opacity: 0;
		}
		66% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	@keyframes pulse-3 {
		66% {
			opacity: 0;
		}
		99% {
			opacity: 1;
		}
	}

	.invisible {
		visibility: hidden;
	}

	.speed {
		font-size: 4rem;
		font-weight: 500;
		line-height: large;
		color: var(--darkBackground);
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

	.keyboard {
		font-size: 1rem;
		display: grid;
		grid-template-rows: 1fr 1fr 1fr;
		justify-content: center;
		white-space: nowrap;
		gap: 0.25rem;
		margin-top: 1rem;
		-webkit-user-select: none;
		-moz-user-select: none;
		user-select: none;
	}

	.row {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.key {
		justify-content: center;
		align-items: center;
		margin: 2px;
		background-color: #ddeff3;
		cursor: default;
		font-size: 1rem;
		user-select: none;
		color: var(--lightTextColor);
		height: 2rem;
		width: 2rem;
		display: flex;
		border-radius: 8px;
	}

	/* :global(body.dark-mode) .key {
		background-color:#ddeff3;
		color: var(--lightTextColor);
	} */

	.key:hover {
		background-color: #bfe4f2;
	}

	.highlight {
		background-color: var(--darkBackground);
	}

	/* :global(body.dark-mode) .highlight {
		background-color: var(--darkBackground);
		color: var(--darkTextColor);
	} */

	.info {
		margin-top: 3rem;

		font-size: 16px;
	}
	.tab-key {
		color: white;
		background-color: var(--lightTextColor);
		padding: 2px 5px;
		border-radius: 5px;
	}

	.enter-key {
		color: white;
		background-color: var(--lightTextColor);
		padding: 2px 5px;
		border-radius: 5px;
	}
	.space {
		background-color: #d9f3fa;
		height: 2rem;
		border-radius: 6px;
		min-width: 330px;
		user-select: none;
	}

	.space:hover {
		background-color: #bfe4f2;
	}
</style>
