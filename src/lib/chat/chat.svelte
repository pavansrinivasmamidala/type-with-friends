<script>
	// @ts-nocheck

	import { onMount, onDestroy } from 'svelte';
	import { playerStore, gameStore, chatStore } from '../store';
	import { getActiveListeners } from '../realtime';
	let text = '';
	let chatContainer;

	onMount(() => {
		console.log('Chat component mounted');
		console.log('Game data:', $gameStore);
		console.log('Player data:', $playerStore);

		// Initialize messages from game data if available
		if ($gameStore && $gameStore.chat) {
			console.log('Initializing messages from game data:', $gameStore.chat);
			chatStore.set($gameStore.chat);
		}

		// Load chat history if we have a game ID
		if ($gameStore && $gameStore.gameId) {
			chatStore.loadChatHistory($gameStore.gameId);
		}
	});

	onDestroy(() => {
		console.log('Chat component destroying');
		// No need to clean up listeners as they're handled by the store
	});

	function sendMessage() {
		const msg = text.trim();
		if (!msg) return;

		// Validate required data
		if (!$gameStore || !$gameStore.gameId) {
			console.error('No game data available');
			return;
		}

		if (!$playerStore || !$playerStore.playerId) {
			console.error('No player data available');
			return;
		}

		console.log('Sending message:', msg);

		// Use the abstracted method
		chatStore.sendMessage(
			$gameStore.gameId,
			$playerStore.playerId,
			$playerStore.nickName,
			msg
		);

		// Clear input immediately for better UX
		text = '';

		// Auto-scroll to bottom immediately
		setTimeout(() => {
			if (chatContainer) {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			}
		}, 50);
	}

	function handleKeyPress(event) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}

	// Format timestamp for display
	function formatTime(timestamp) {
		if (!timestamp) return '';
		const date = new Date(timestamp);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	// Check if message is from current player
	function isOwnMessage(message) {
		return message.playerId === $playerStore?.playerId;
	}

	function refreshListeners() {
		getActiveListeners()
	}
</script>

<div class="chat-window">
	<div class="messages-container" bind:this={chatContainer}>
		{#if $chatStore.length === 0}
			<div class="no-messages">
				<p>No messages yet. Start the conversation!</p>
			</div>
		{:else}
			{#each $chatStore as message, index}
				<div class="message {isOwnMessage(message) ? 'own-message' : 'other-message'}">
					<div class="message-header">
						<span class="player-name">{message.playerNick || 'Anonymous'}</span>
						<span class="timestamp">{formatTime(message.timestamp)}</span>
					</div>
					<div class="message-content">
						{message.message}
					</div>
				</div>
			{/each}
		{/if}
	</div>

	<form class="input-div" on:submit|preventDefault={sendMessage}>
		<input
			type="text"
			class="chat-input"
			bind:value={text}
			on:keypress={handleKeyPress}
			placeholder="Type your message..."
			maxlength="500"
			/>
			<!-- on:keydown={handleKeyPress} -->
		<button class="send-button" on:click={refreshListeners} > Debug </button>
		<button type="submit" class="send-button" disabled={!text.trim()}> Send </button>
	</form>
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

	.messages-container {
		flex: 1;
		overflow-y: auto;
		padding: 10px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		max-height: calc(45vh - 60px);
	}

	.no-messages {
		text-align: center;
		color: #666;
		font-style: italic;
		margin-top: 20px;
	}

	.message {
		padding: 8px 12px;
		border-radius: 12px;
		max-width: 80%;
		word-wrap: break-word;
	}

	.own-message {
		align-self: flex-end;
		background-color: var(--lightTextColor);
		color: white;
	}

	.other-message {
		align-self: flex-start;
		background-color: #f0f0f0;
		color: var(--darkBackground);
	}

	.message-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 4px;
		font-size: 12px;
		opacity: 0.8;
		gap: 10px;
	}

	.player-name {
		font-weight: bold;
	}

	.timestamp {
		font-size: 10px;
	}

	.message-content {
		font-size: 14px;
		line-height: 1.4;
	}

	.input-div {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
		border-top: 2px var(--darkBackground) solid;
		background-color: white;
		border-radius: 0 0 8px 8px;
	}

	.chat-input {
		flex: 1;
		border: none;
		outline: none;
		font-size: 16px;
		padding: 8px 12px;
		border-radius: 20px;
		background-color: #f5f5f5;
		margin-right: 10px;
	}

	.chat-input:focus {
		background-color: #e8e8e8;
	}

	.send-button {
		padding: 8px 16px;
		cursor: pointer;
		color: white;
		border-radius: 20px;
		background-color: var(--lightTextColor);
		border: none;
		font-size: 18px;
		font-weight: normal;
		transition: opacity 0.2s;
	}

	.send-button:hover:not(:disabled) {
		opacity: 0.9;
	}

	.send-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.debug-button {
		padding: 8px 12px;
		cursor: pointer;
		color: white;
		border-radius: 20px;
		background-color: #666;
		border: none;
		font-size: 14px;
		margin-left: 8px;
		transition: opacity 0.2s;
	}

	.debug-button:hover {
		opacity: 0.8;
	}

	.clear-button {
		padding: 8px 12px;
		cursor: pointer;
		color: white;
		border-radius: 20px;
		background-color: #dc3545;
		border: none;
		font-size: 14px;
		margin-left: 8px;
		transition: opacity 0.2s;
	}

	.clear-button:hover {
		opacity: 0.8;
	}

	/* Dark mode styles */
	:global(body.dark-mode) .chat-window {
		border: 2px solid white;
		background-color: #2a2a2a;
	}

	:global(body.dark-mode) .other-message {
		background-color: #404040;
		color: white;
	}

	:global(body.dark-mode) .input-div {
		background-color: #2a2a2a;
		border-top: 2px solid white;
	}

	:global(body.dark-mode) .chat-input {
		background-color: #404040;
		color: white;
	}

	:global(body.dark-mode) .chat-input:focus {
		background-color: #505050;
	}

	/* Scrollbar styling */
	.messages-container::-webkit-scrollbar {
		width: 6px;
	}

	.messages-container::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 3px;
	}

	.messages-container::-webkit-scrollbar-thumb {
		background: #c1c1c1;
		border-radius: 3px;
	}

	.messages-container::-webkit-scrollbar-thumb:hover {
		background: #a8a8a8;
	}
</style>
