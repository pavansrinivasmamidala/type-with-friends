<script>
	// @ts-nocheck

	import words from '$lib/words';

	let wordsArray = [];
    let wordIndex = 0;
    let letterIndex = 0;
    let timer = 0;
	let timerRunning = false;
	let isCompleted = false;

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

	console.log(wordsArray);



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
		if (event.key === wordsArray[wordIndex].letters[letterIndex].text) {
			
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
	{#each wordsArray as word}
		<span class="word">
			{#if word.isActive}
				<span>|</span>
			{/if}
			{#each word.letters as letter}
				{letter.text}
			{/each}
		</span>
	{/each}
</div>

<style>
	.container {
		margin: auto;
		width: 60vw;
	}

	.word {
		font-size: 26px;
		color: var(--darkBackground);
		line-height: 33px;
	}
</style>
