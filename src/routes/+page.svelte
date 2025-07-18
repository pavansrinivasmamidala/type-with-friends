<script>
	// @ts-nocheck

	import Icon from 'svelte-awesome';
	import user from 'svelte-awesome/icons/user';
	import users from 'svelte-awesome/icons/users';
	import arrowRight from 'svelte-awesome/icons/arrowRight';
	import { playerStore, gameStore, nick, socketId } from '../lib/store';
	import { onDestroy } from 'svelte';
	import { waitForSocketConnection } from '$lib/realtime';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browserStorage } from '$lib/browser-storage';

	onMount(async () => {
		console.log('Home page mounted');
		
		// Wait for socket connection before proceeding
		const currentSocketId = await waitForSocketConnection();
		console.log('Socket connected with ID:', currentSocketId);
		
		// Check if player exists in browser storage
		const storedPlayer = browserStorage.getPlayer();
		
		if (storedPlayer && Object.keys(storedPlayer).length > 0) {
			console.log('Found existing player in storage:', storedPlayer);
			
			// Update socket ID if it's different
			if (storedPlayer.socketId !== currentSocketId) {
				console.log('Updating stored player socket ID from', storedPlayer.socketId, 'to', currentSocketId);
				await playerStore.updateSocketId(storedPlayer.playerId);
			}
			
			// Update stores with stored data
			playerStore.set(storedPlayer);
			nick.set(storedPlayer.nickName);
		} else {
			console.log('No stored player found, creating new player');
			// Create new player only if none exists
			await playerStore.createPlayer(true);
		}
	});

	// Function to handle multiplayer click
	function handleMultiplayerClick() {
		// Create a new game using the abstracted method
		gameStore.createGame($playerStore.playerId);
		
		// Listen for game creation response (one-time listener)
		const gameCreatedHandler = (data) => {
			console.log('Game created:', data);
			// Remove the listener immediately after use
			gameStore.cleanup();
			// Redirect to the new game
			goto(`/multiplayer/${data.gameId}`);
		};
		
		// We need to temporarily add a listener for this specific case
		// This could be improved by adding a callback system to the store
		import('$lib/realtime').then(({ io }) => {
			io.on('game-created', gameCreatedHandler);
		});
	}

	onDestroy(() => {
		console.log('Home page destroying, cleaning up listeners');
		// Clean up any listeners that might have been added
		import('$lib/realtime').then(({ io }) => {
			io.off('new-player');
			io.off('game-created');
		});
	});
</script>

<div class="container">
	<div class="nick-div">
		<span class="nick-title">Welcome to the game!</span>
		<span class="nick-name">{$playerStore.nickName}</span>
		<!-- svelte-ignore a11y-autofocus -->
		<!-- <input type="text" autofocus bind:value={$nick} class="nick-input" placeholder="Enter name" /> -->
	</div>

	<span class="pick-text">Pick a mode</span>
	<div class="buttons">
		<div class="icon-button-container">
			<a class="icon-button" href="/solo">
				<Icon data={user} scale={10} style="color:var(--lightTextColor)" />
			</a>
			<span class="icon-under-text">Single Player</span>
		</div>
		<div class="icon-button-container">
			<button class="icon-button" on:click={handleMultiplayerClick}>
				<Icon data={users} scale={10} style="color:var(--lightTextColor);" />
			</button>
			<span class="icon-under-text">Multi Player</span>
		</div>
	</div>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80%;
		flex-direction: column;
	}

	.buttons {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 45vw;
		margin-top: 40px;
	}

	.icon-button-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.icon-button {
		background-color: white;
		border: 3px solid var(--darkBackground);
		border-radius: 20px;
		height: 25vh;
		width: 20vw;
		cursor: pointer;
		transition: all ease-in-out 0.3s;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}

	.icon-button:hover {
		background-color: var(--darkBackground);
	}

	.icon-under-text {
		color: var(--darkBackground);
		padding: 15px;
		font-weight: 600;
		font-size: 30px;
		border-radius: 10px;
		text-decoration: none;
		cursor: pointer;
		text-align: center;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
	}

	.nick-div {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-direction: column;
		margin-bottom: 40px;
	}

	.nick-title {
		font-size: 28px;
		font-weight: 600;
		color: var(--darkBackground);
	}

	.nick-name {
		font-size: 40px;
		font-weight: 600;
		color: var(--lightTextColor);
	}

	.pick-text {
		font-size: 40px;
		font-weight: 600;
		color: var(--darkBackground);
	}

	.nick-input {
		height: 50px;
		font-size: 28px;
		border: 3px solid var(--darkBackground);
		border-radius: 7px;
		padding-left: 8px;
		width: 30vw;
		background-color: white;
		color: var(--darkBackground);
	}

	.nick-input:focus {
		border: 4px solid var(--lightTextColor);
		outline: none;
	}

	.arrow-icon {
		border-radius: 50%;
		background-color: var(--lightTextColor);
		border: 2px solid var(--lightTextColor);
		padding: 10px 12px;
		margin-left: 8px;
		cursor: pointer;
	}

	:global(body.dark-mode) .nick-title {
		color: white;
	}

	:global(body.dark-mode) .nick-name {
		color: var(--darkTextColor);
	}

	:global(body.dark-mode) .pick-text {
		color: white;
	}

	:global(body.dark-mode) .icon-under-text {
		color: white;
	}

	:global(body.dark-mode) .icon-button {
		background-color: var(--darkBackground);
		border: 3px solid white;
	}
	:global(body.dark-mode) .icon-button:hover {
		background-color: white;
	}
</style>
