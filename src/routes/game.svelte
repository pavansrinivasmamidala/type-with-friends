<script>
	// @ts-nocheck

	import Button from '$lib/button.svelte';
	import About from './about.svelte';
	import restart from '../lib/icons/rotate-right-solid.svg';
	import words from './words.js';
	import Icon from 'svelte-awesome';
	import {refresh} from 'svelte-awesome/icons'

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
	console.log(updatedWords);

	//
	updatedWords.map((word, idx) => {
		word.map((letter, i) => {
			main.push(letter);
		});
	});

	function handleKeydown(event) {
		if (!timerRunning) {
			timerRunning = true;
			startTimer();
		}

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

		if (!isCompleted && index === main.length - 1) {
			isCompleted = true;
			timerRunning = false;
		}
	}

	function startTimer() {
		setInterval(function () {
			if (timerRunning) timer++;
		}, 1000);
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="container">
	<div>
		<span class:invisible={!timerRunning} class="timer">{timer}</span>
	</div>
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

	<div class="completed success">
		<h2>{isCompleted ? 'Completed' : ''}</h2>
	</div>

	<div>
		<span class:speed={isCompleted}
			>{isCompleted ? `${Math.trunc(main.length / (timer / 12))} WPM` : ''}</span
		>
	</div>

	<div>
		<Icon data={refresh} />
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
		margin-top: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
		word-wrap: break-word;
		flex-wrap: wrap;
		font-family: Georgia, 'Times New Roman', Times, serif;
	}

	.selected {
		color: #62cfe6;
	}

	.success {
		position: fixed;
		bottom: 50px;
		justify-content: center;
		color: #62cfe6;
	}

	p {
		font-size: large;
		color: black;
		margin: 11px 0px;
	}

	:global(body.dark-mode) p {
		color: white;
	}

	:global(body.dark-mode) .container {
		background-color: black;
	}
	#blink {
		position: relative;
		animation: blink 2s infinite;
		height: 32px;
		width: 2.5px;
		background-color: #62cfe6;
	}

	.letter {
		font-size: 1.5rem;
		line-height: 1.4rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
	}

	@keyframes blink {
		50% {
			background-color: white;
		}
		100% {
			background-color: #62cfe6;
		}
	}

	.invisible {
		visibility: hidden;
	}

	.speed {
		font-size: 30px;
		font-weight: 700;
		line-height: large;
		color: #62cfe6;
	}

	.timer {
		font-size: 60px;
		line-height: 60px;
		color: #62cfe6;
	}
</style>
