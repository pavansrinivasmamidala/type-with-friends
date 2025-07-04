<script>
	// @ts-nocheck

	import { io } from '$lib/realtime';
	import { onMount } from 'svelte';
	import { nick, game, player } from '../store';

	let text = '';
	let messages = [];
	let gameData = {};
	let playerData = {};

	onMount(() => {});

	io.on('message', (message) => {
		messages = [...message];
		console.log(messages);
	});

	let nickName = '';
	nick.subscribe((value) => (nickName = value));
	game.subscribe((value) => (gameData = value));
	player.subscribe((value) => (playerData = value));

	function sendMessage() {
		const msg = text.trim();
		if (!msg) return;

		console.log(gameData);
		console.log(playerData);

		text = '';
		io.emit('message', {
			gameId: gameData.gameId,
			playerId: playerData.playerId,
			playerNick: playerData.nickName,
			message: msg
		});
	}
</script>

<div class="chat-window">
	<div>
		{#each messages as message}
			<p>{message ? message.message : ''}</p>
		{/each}
	</div>
	<div class="input-div">
		<input type="text" class="chat-input" bind:value={text} />
		<button class="send-button" on:click={sendMessage}>send</button>
	</div>
</div>

<style>
	.chat-window {
		height: 45vh;
		border: 1px solid black;
		width: 40vw;
		border-radius: 8px;
		box-shadow: 0 0 0.5rem -0.25rem var(--lightTextColor),
			inset 0 0 0.5rem -0.75rem var(--lightTextColor);
		border: 2px var(--darkBackground) solid;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.input-div {
		display: flex;
		justify-content: flex-end;
		align-items: flex-start;
	}
	.chat-input {
		width: 85%;
		border-top: 2px var(--darkBackground) solid;
		border-right: 2px var(--darkBackground) solid;
		border-left: none;
		border-bottom: none;
		border-radius: 4px;
		height: 4vh;
		font-size: 22px;
		color: var(--darkBackground);
		background: none;
		box-shadow: none;
		position: absolute;
		bottom: 0;
		left: 0;
		padding-left: 4px;
	}

	.chat-input:focus {
		outline: none;
	}

	.send-button {
		width: 12%;
		cursor: pointer;
		color: white;
		border-radius: 5px;
		position: absolute;
		right: 0;
		bottom: 0;
		background-color: var(--lightTextColor);
		border: none;
		height: 4vh;
		font-size: 20px;
		opacity: 0.75;
		margin: 4px;
	}

	:global(body.dark-mode) .chat-input {
		border-top: 2px white solid;
		border-right: 2px white solid;
		color: white;
	}

	:global(body.dark-mode) .chat-window {
		border: 2px solid white;
	}
</style>
