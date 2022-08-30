<script>
	// @ts-nocheck

	import io from 'socket.io-client';
	import { onMount } from 'svelte';
	import link from '../lib/icons/link.png';
	import send from '../lib/icons/send.png';
	var test = '';
	let startGame = false;
	let tooltip = 'its working';
	const socket = io('http://localhost:3001');
	console.log('multiplayer is loaded');

	function socketFunction() {
		socket.emit('message', 'test input');
	}
	socket.on('test', (msg) => {
		test = msg;
	});

	var move = 0;

	let owner = "Owner's Lobby";
	let url = '/h564jg';

	let players = ['Player 1', 'Player 2', 'Player 3'];

	function copy() {
		navigator.clipboard.writeText(url.slice(1));
	}

	// onMount(async() => {
	// 	prompt('is this working');
	// });
</script>

<div class="container">
	{#if startGame}
		<div>
			<div>
				{#each players as player}
					<div class="tracker">
						<span class="player-name">{player}</span>
						<p class="ball" style={`transform: translateX(${move}%);`} />
						<p class="line" />
					</div>
				{/each}
			</div>
			<button
				on:click={() => {
					move = move + 100;
				}}
				class="btn">move</button
			>
			<button
				class="btn"
				data-tooltip={tooltip}
				on:click={() => {
					startGame = !startGame;
				}}
			>
				<slot />
				{startGame ? 'Menu' : 'Start Game'}</button
			>
		</div>
	{:else}
		<div class="game-info">
			<div class="margin-bottom-30">
				<span class="owner-name">{owner}</span>
			</div>
			<!-- <button 
			on:click={() => socketFunction()}> click</button> -->
			<div class="chat-window">
				<div />
				<div class="input-div">
					<input type="text" class="chat-input" />
					<button class="send-button">send</button>
				</div>
			</div>
		</div>

		<div class="game-options">
			<div class="margin-bottom-30">
				<button class="copy" on:click={() => copy()}>
					<img src={link} height="20px" style="margin-right: 5px;" alt="copy-icon" />
					<span class="url">Copy Link</span>
				</button>
			</div>
			<div class="player-info">
				<div class="players">
					{#each players as player}
						<div class="player">
							<p class="profile" />
							<span class="player-name">{player}</span>
						</div>
					{/each}
				</div>

				<button
					class="btn"
					on:click={() => {
						startGame = !startGame;
					}}>{startGame ? 'Menu' : 'Start Game'}</button
				>
			</div>
		</div>
	{/if}
</div>

<style>
	.line {
		background-color: var(--darkBackground);
		width: 50vw;
		height: 3px;
		border-radius: 4px;
		margin-bottom: 25px;
	}

	.ball {
		background-color: var(--darkBackground);
		box-shadow: 0 0 0.2rem 0.025rem var(--lightTextColor),
			inset 0 0 1rem -0.75rem var(--lightTextColor);
		height: 15px;
		width: 15px;
		border-radius: 100%;
		transform: translateX(20px);
		margin-bottom: -26px;
		transition: ease-in-out all 0.5s;
	}

	:global(body.dark-mode) .line {
		background-color: var(--lightTextColor);
	}

	:global(body.dark-mode) .ball {
		background-color: var(--lightTextColor);
		box-shadow: none;
	}

	.container {
		padding: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.game-info {
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		box-shadow: 3px;
		margin: 30px;
		width: 42vw;
		border-radius: 15px;
	}

	.owner-name {
		font-size: 26px;
		font: bold;
		color: var(--lightTextColor);
		margin-bottom: 30px;
	}

	.copy {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 2px var(--darkBackground) solid;
		padding: 8px 16px;
		border-radius: 8px;
		background: none;
		color: var(--lightTextColor);
		box-shadow: 0 0 0.3rem -0.25rem var(--lightTextColor),
			inset 0 0 0.5rem -0.75rem var(--lightTextColor);
		cursor: pointer;
	}

	.url {
		font-size: 20px;
		color: var(--lightTextColor);
	}

	.game-options {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		flex-direction: column;
		max-height: 52vh;
	}

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

	.player-info {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;

		height: 45vh;
	}

	.players {
		max-height: 10vh;
		margin-left: 5px;
	}
	.player {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.profile {
		border: 2px solid var(--darkBackground);
		border-radius: 100%;
		height: 15px;
		width: 15px;
		margin-right: 6px;
		background-color: var(--darkBackground);
	}

	.player-name {
		font-size: 22px;
		font: bold;
		color: var(--lightTextColor);
	}

	.btn {
		padding: 8px 12px;
		border-radius: 8px;
		background: none;
		color: var(--lightTextColor);
		box-shadow: 0 0 0.3rem -0.25rem var(--lightTextColor),
			inset 0 0 0.5rem -0.75rem var(--lightTextColor);
		cursor: pointer;
		border: 2px var(--darkBackground) solid;
		font-size: 22px;
	}

	.margin-bottom-30 {
		margin-bottom: 30px;
	}

	:global(body.dark-mode) .chat-window {
		border: 2px solid white;
	}

	:global(body.dark-mode) .owner-name {
		color: white;
	}

	:global(body.dark-mode) .copy {
		border: 2px solid var(--lightTextColor);
		background: none;
		color: white;
	}

	:global(body.dark-mode) .chat-input {
		border-top: 2px white solid;
		border-right: 2px white solid;
		color: white;
	}

	:global(body.dark-mode) .start-game {
		border: 1px solid white;
	}

	:global(body.dark-mode) .player-name {
		color: white;
	}
</style>
