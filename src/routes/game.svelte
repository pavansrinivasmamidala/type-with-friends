<script>
	// @ts-nocheck

	import words from './words.js';
	import Icon from 'svelte-awesome';
	import rotateRight from 'svelte-awesome/icons/rotateRight';

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
	<div>
		<span class:speed={isCompleted}
			>{isCompleted ? `${Math.trunc(main.length / (timer / 12))} WPM` : ''}</span
		>
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

	<div>
		<button class="refresh" onclick="location.reload()">
			<Icon data={rotateRight} scale="1.5" style="color:#62cfe6" />
		</button>
	</div>

	<span class:info={isCompleted} class="invisible">Tab + Enter to restart</span>
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
		color: #212b43;
	}

	.selected {
		color: #62cfe6;
	}

	.refresh {
		margin-top: 30px;
		border: none;
		background-color: white;
		padding: 5px;
		cursor: pointer;
	}

	.refresh:focus-visible {
		outline: 1px solid #212b43;
		background-color: #212b43;
		border-radius: 4px;
		padding-bottom: 0px;
	}

	p {
		font-size: large;
		color: #212b43;
		margin: 11px 0px;
	}

	:global(body.dark-mode) p {
		color: white;
	}
	:global(body.dark-mode) .timer  {
		color: white;
	}

	:global(body.dark-mode) .refresh  {
		background-color: #212b43;
	}

	:global(body.dark-mode) .refresh:focus-visible  {
		border: #62cfe6;
	}
	:global(body.dark-mode) .container {
		background-color: #212b43;
	}
	#blink {
		position: relative;
		animation: blink 2s infinite;
		height: 35px;
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
		font-size: 100px;
		line-height: 60px;
		color: #212b43;
	}

	.info{
		font-size: 13px;
		visibility: visible;
		margin-top: 20px;
	}
</style>
