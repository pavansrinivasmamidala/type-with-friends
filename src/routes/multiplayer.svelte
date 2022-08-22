<script>
	// @ts-nocheck

	import io from 'socket.io-client';
	import link from '../lib/icons/link.png';
	import send from '../lib/icons/send.png';
	var test = '';
	const socket = io('http://localhost:3001');
	console.log('multiplayer is loaded');

	function socketFunction() {
		socket.emit('message', 'test input');
	}
	socket.on('test', (msg) => {
		test = msg;
	});

	let owner = "Owner's Lobby";
	let url = '/h564jg';

	let players = ['Player 1', 'Player 2', 'Player 3'];

	function copy() {
		navigator.clipboard.writeText(url);
	}
</script>

<div class="container">
	<div class="game-info">
		<div>
			<span class="owner-name">{owner}</span>
		</div>
		<!-- <button 
		on:click={() => socketFunction()}> click</button> -->
		<div>
			<button class="copy" on:click={() => copy()}>
				<img src={link} height="20px" style="margin-right: 5px;" alt="copy-icon" />
				<span class="url">Copy Link</span>
			</button>
		</div>
	</div>

	<div class="game-options">
		<div class="chat-window">
			<div />
			<div>
				<input type="text" class="chat-input" />
				<img src={send} alt="send-icon" class="send-icon" />
			</div>
		</div>
		<div class="player-info">
			<div>
				{#each players as player}
				<div class="player">
					<p class="profile" />
					<span class="player-name">{player}</span>
				</div>
			{/each}
			</div>
			
			<button class="start-game">Start Game</button>
		</div>
	</div>
</div>

<style>
	.container {
		padding: 50px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.game-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 30px;
		box-shadow: 3px;
		padding: 20px;
		width: 55vw;
		border-radius: 15px;
	}

	.owner-name {
		font-size: 26px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
		font: bold;
		color: var(--lightTextColor);
		padding: 8px 20px;
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
		align-items: center;
		justify-content: space-between;
		margin-top: 40px;
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

	.chat-input {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 91%;
		border-top: 2px var(--darkBackground) solid;
		border-right: 2px var(--darkBackground) solid;
		border-radius: 4px;
		height: 4vh;
		background: none;
		box-shadow: none;
	}

	.send-icon {
		position: absolute;
		bottom: 5px;
		right: 5px;
		height: 20px;
		cursor: pointer;
		padding: 7px;
		border-radius: 5px;
	}

	.player-info {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
		margin-left: 30px;
		height: 45vh;
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

	.player-name{
		font-size: 24px;
		font: bold;

		color: var(--lightTextColor);
	}

	.start-game {
		padding: 8px 16px;
		border-radius: 8px;
		background: none;
		color: var(--lightTextColor);
		box-shadow: 0 0 0.3rem -0.25rem var(--lightTextColor),
			inset 0 0 0.5rem -0.75rem var(--lightTextColor);
		cursor: pointer;
		border: 2px var(--darkBackground) solid;
		font-size: 20px;
		width: 150px;
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
	}
</style>
