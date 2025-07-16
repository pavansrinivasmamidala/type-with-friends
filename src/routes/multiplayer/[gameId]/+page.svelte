<script>
	// @ts-nocheck

	import { waitForSocketConnection } from '$lib/realtime';
	import { onMount } from 'svelte';
	import play from 'svelte-awesome/icons/play';
	import { Icon } from 'svelte-awesome';
	import link from '../../../lib/icons/link.png';
	import { playerStore, gameStore, chatStore, nick, socketId } from '../../../lib/store';
	import { onDestroy } from 'svelte';
	import Chat from '$lib/chat/chat.svelte';
	import Tracker from '$lib/tracker/tracker.svelte';
	import ConnectionStatus from '$lib/ConnectionStatus.svelte';
	import { writable } from 'svelte/store';
	import { v4 as uuidv4 } from 'uuid'; // Import the uuid library
	import Modal from '$lib/Modal/Modal.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browserStorage } from '$lib/browser-storage';

	let startGame = false;
	let tooltip = false;
	let nickName = $nick;
	let gameData = $gameStore;
	let playerData = $playerStore;
	let id = $socketId;

	let tooltipText = 'Click to copy';
	let isModalOpen = false;
	let showNotificationMessage = false;
	let notificationMessage = '';

	let players = []

	function openModal() {
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
	}

	// Function to join game after player is created
	function joinGame(gameId) {
		console.log('Joining game with player ID:', $playerStore.playerId);
		gameStore.joinGame(gameId, $playerStore.playerId);
	}

	function showNotification(message) {
		notificationMessage = message;
		showNotificationMessage = true;

		// Auto-hide after 5 seconds
		setTimeout(() => {
			showNotificationMessage = false;
		}, 5000);
	}

	onMount(async () => {
		const gameId = $page.params.gameId;
		console.log('gameId from params', gameId);

		// Wait for socket connection before proceeding
		const currentSocketId = await waitForSocketConnection();
		console.log('Socket connected with ID:', currentSocketId);

		const unsubscribePage = page.subscribe(($page) => {
			if (gameId) {
				// Check if player exists in storage
				const storedPlayer = browserStorage.getPlayer();

				if (storedPlayer && Object.keys(storedPlayer).length > 0) {
					console.log('Using stored player:', storedPlayer);

					// Update socket ID if it's different
					if (storedPlayer.socketId !== currentSocketId) {
						console.log(
							'Updating stored player socket ID from',
							storedPlayer.socketId,
							'to',
							currentSocketId
						);
						playerStore.updateSocketId(storedPlayer.playerId);
					}

					playerStore.set(storedPlayer);
					nick.set(storedPlayer.nickName);
					// Join game directly with existing player
					joinGame(gameId);
				} else {
					console.log('No stored player, creating new player');
					playerStore.createPlayer(false);
				}
			}
		});

		// Subscribe to game data changes
		const unsubscribeGame = gameStore.subscribe((game) => {
			if (game.players) {
				// For now, we'll just store the player IDs
				// You might want to fetch player details separately if needed
				players = game.players;
			}
		});

		// Handle browser tab closing
		const handleBeforeUnload = () => {
			if ($playerStore.playerId && $gameStore.gameId) {
				// Try to send leave-game event before tab closes
				gameStore.leaveGame($gameStore.gameId, $playerStore.playerId);
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			unsubscribePage();
			unsubscribeGame();
			// Leave the game when component unmounts
			if ($playerStore.playerId && $gameStore.gameId) {
				gameStore.leaveGame($gameStore.gameId, $playerStore.playerId);
			}
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	});

	function copy() {
		const gameUrl = `${window.location.origin}/multiplayer/${$page.params.gameId}`;
		navigator.clipboard.writeText(gameUrl);
		tooltipText = 'Copied!';
	}
</script>

<div class="container">
	<!-- <Modal isOpen={isModalOpen} close={closeModal}>
		<h1>Hello just to check if the modal is working</h1>
	</Modal> -->

	<ConnectionStatus />

	<!-- Notification -->
	{#if showNotificationMessage}
		<div class="notification">
			<div class="notification-content">
				<span class="notification-icon">⚠️</span>
				<span class="notification-text">{notificationMessage}</span>
			</div>
		</div>
	{/if}

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
	{/if}

	<!-- Chat component - always mounted but conditionally visible -->
	<div class="game-info" class:hidden={startGame}>
		{#if !startGame}
			<div class="margin-bottom-30">
				<span class="owner-name"> {$playerStore.nickName}'s lobby</span>
			</div>
		{/if}
		<!-- <button 
		on:click={() => socketFunction()}> click</button>  -->
		<Chat />
	</div>

	{#if !startGame}
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
					<span class="url">Copy Game Link</span>
				</button>
			</div>
			<div class="player-info">
				<div class="players">
					{#if players.length === 0}
						<div class="no-players">
							<p>No players in lobby yet...</p>
						</div>
					{:else}
						{#each players as player}
							<div class="player">
								<span class="player-name">{player.nickName}</span>
								<p class="profile" />
							</div>
						{/each}
					{/if}
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

<!-- 
<span class="coming-soon"> Multiplayer Coming soon..!!</span>

<style>
	.coming-soon{
		font-size: xx-large;
		font-weight: 600;
		padding-top: 200px;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style> -->

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
		color: var(--darkBackground);
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
		gap: 10px;
	}

	.profile {
		border: 2px solid var(--lightTextColor);
		border-radius: 100%;
		height: 15px;
		width: 15px;
		margin-right: 6px;
		background-color: var(--lightTextColor);
	}

	.player-name {
		font-size: 22px;
		font: bold;
		color: var(--darkBackground);
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

	.hidden {
		display: none;
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

	.no-players {
		text-align: center;
		color: #666;
		font-style: italic;
		padding: 20px;
	}

	.notification {
		position: fixed;
		top: 20px;
		right: 20px;
		background: rgba(255, 193, 7, 0.95);
		border: 1px solid #ff9800;
		border-radius: 8px;
		padding: 12px 16px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		z-index: 1001;
		animation: slideIn 0.3s ease-out;
		max-width: 300px;
	}

	.notification-content {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.notification-icon {
		font-size: 16px;
	}

	.notification-text {
		font-size: 14px;
		color: #333;
		font-weight: 500;
	}

	@keyframes slideIn {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	/* Dark mode notification */
	:global(body.dark-mode) .notification {
		background: rgba(255, 193, 7, 0.9);
		border-color: #ffc107;
	}

	:global(body.dark-mode) .notification-text {
		color: #000;
	}
</style>
