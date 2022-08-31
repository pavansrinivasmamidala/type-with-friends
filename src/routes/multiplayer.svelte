<script>
	// @ts-nocheck

	import io from 'socket.io-client';
	import { onMount } from 'svelte';
	import play from 'svelte-awesome/icons/play';
	import { Icon } from 'svelte-awesome';
	import link from '../lib/icons/link.png';
	import { nick } from '../lib/store';
	import { onDestroy } from 'svelte';
	import Chat from '$lib/chat/chat.svelte';
	import Tracker from '$lib/tracker/tracker.svelte';

	var test = '';
	let startGame = false;
	let tooltip = false;
	// const socket = io('http://localhost:3001');
	// console.log('multiplayer is loaded');

	// function socketFunction() {
	// 	socket.emit('message', 'test input');
	// }
	// socket.on('test', (msg) => {
	// 	test = msg;
	// });

	let url = '/h564jg';
	let tooltipText = 'Click to copy';

	let players = ['Player 1', 'Player 2', 'Player 3'];

	function copy() {
		navigator.clipboard.writeText(url.slice(1));
		tooltipText = 'Copied';
	}

	let nickName = '';

	const unsub = nick.subscribe((value) => (nickName = value));

	onDestroy(unsub);
</script>

<div class="container">
	{#if startGame}
		<div>
			<Tracker />
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
				<span class="owner-name">{nickName ? nickName : 'Owner'}'s lobby</span>
			</div>
			<!-- <button 
			on:click={() => socketFunction()}> click</button> -->
			<Chat />
		</div>

		<div class="game-options">
			<div class="margin-bottom-30 copy-div">
				<div class="tooltip">
					<span class="copy-tooltip">{tooltipText}</span>
					<Icon
						data={play}
						style="color:var(--lightTextColor); transform:rotate(90deg);margin-top:-7px"
					/>
				</div>

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

	.tooltip {
		display: flex;
		flex-direction: column;
		align-items: center;
		opacity: 0;
		transition: all ease-in-out 0.4s;
	}
	.copy-tooltip {
		background-color: var(--lightTextColor);
		color: white;
		font: bold;
		padding: 5px;
		position: relative;
		margin-top: -31px;
		border-radius: 6px;
		z-index: 10;
	}

	.copy-div:hover .tooltip {
		opacity: 1;
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

	:global(body.dark-mode) .owner-name {
		color: white;
	}

	:global(body.dark-mode) .copy {
		border: 2px solid var(--lightTextColor);
		background: none;
		color: white;
	}

	:global(body.dark-mode) .player-name {
		color: white;
	}
</style>
