<script>
	import { onMount, onDestroy } from 'svelte';
	import { connectionStore } from './stores/connectionStore';

	export const { statusColor, statusText, signalStrength } = connectionStore; 
	onMount(() => {
		console.log('ConnectionStatus component mounted');
		console.log('connectionStore value:', $connectionStore);

		// The connection store automatically handles all socket listeners and ping
	});

	onDestroy(() => {
		console.log('ConnectionStatus component destroying');
		// The connection store handles its own cleanup
	});
</script>

<div
	class="connection-status"
	class:connected={$connectionStore.status === 'connected'}
	class:disconnected={$connectionStore.status === 'disconnected'}
>
	<div class="signal-icon">
		<!-- Signal bars -->
		<div class="signal-bars">
			{#each Array(4) as _, i}
				<div class="signal-bar" class:active={i - 1 < $signalStrength} />
			{/each}
		</div>
	</div>
	<div class="status-info">
		<!-- <div class="status-indicator" style="background-color: {$connectionStore.statusColor}" /> -->
		<div class="status-text">{$statusText}</div>
	</div>
</div>

<style>
	.connection-status {
		position: fixed;
		bottom: 25px;
		right: 20px;
		background: rgba(255, 255, 255, 0.95);
		border: 1px solid var(--lightTextColor);
		border-radius: 8px;
		padding: 6px 12px;
		display: flex;
		align-items: center;
		gap: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		transition: all 0.3s ease;
		min-width: 60px;
		height: 20px;
	}

	.connection-status.connected {
		border-color: var(--lightTextColor);
	}

	.connection-status.disconnected {
		border-color: #f44336;
		background: rgba(244, 67, 54, 0.1);
	}

	.signal-icon {
		display: flex;
		align-items: flex-end;
		height: 20px;
		gap: 2px;
	}

	.signal-bars {
		display: flex;
		align-items: flex-end;
		gap: 2px;
		height: 16px;
	}

	.signal-bar {
		width: 3px;
		background-color: #ddd;
		border-radius: 1px;
		transition: background-color 0.3s ease;
	}

	.signal-bar:nth-child(1) {
		height: 4px;
	}

	.signal-bar:nth-child(2) {
		height: 8px;
	}

	.signal-bar:nth-child(3) {
		height: 12px;
	}

	.signal-bar:nth-child(4) {
		height: 16px;
	}

	.signal-bar:nth-child(5) {
		height: 20px;
		background-color: #388e3c; /* or another color for the best signal */
	}
	.signal-bar.active:nth-child(5) {
		background-color: #388e3c;
	}

	.signal-bar.active {
		background-color: var(--lightTextColor);
	}

	

	.status-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
	}

	.status-text {
		font-size: 15px;
		font-weight: 500;
		color: #333;
		white-space: nowrap;
	}

	.status-indicator {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		transition: background-color 0.3s ease;
	}

	/* Dark mode styles */
	:global(body.dark-mode) .connection-status {
		background: rgba(40, 40, 40, 0.95);
		border-color: #555;
	}

	:global(body.dark-mode) .status-text {
		color: #fff;
	}

	/* :global(body.dark-mode) .signal-bar {
		background-color: #555;
	} */

	/* Animation for connecting state */
	.connection-status:not(.connected):not(.disconnected) .signal-bars {
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.connection-status {
			bottom: 10px;
			right: 10px;
			padding: 6px 8px;
			min-width: 100px;
		}

		.status-text {
			font-size: 10px;
		}
	}
</style>
