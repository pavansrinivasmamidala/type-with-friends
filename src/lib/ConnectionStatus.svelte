<script>
	import { onMount, onDestroy } from 'svelte';
	import { io } from '$lib/realtime';
	import { writable, derived } from 'svelte/store';
	import { player, socketId } from '$lib/store';

	// Connection status store
	const connectionStatus = writable('connecting'); // 'connected', 'disconnected', 'connecting'
	const pingTime = writable(0);
	const lastPingTime = writable(0);

	// Reactive computed values
	const statusColor = derived([connectionStatus, pingTime], ([$connectionStatus, $pingTime]) => {
		switch ($connectionStatus) {
			case 'connected':
				return $pingTime < 100 ? '#4CAF50' : $pingTime < 300 ? '#FF9800' : '#F44336';
			case 'connecting':
				return '#FF9800';
			case 'disconnected':
				return '#F44336';
			default:
				return '#9E9E9E';
		}
	});

	const statusText = derived([connectionStatus, pingTime], ([$connectionStatus, $pingTime]) => {
		switch ($connectionStatus) {
			case 'connected':
				return $pingTime > 0 ? `${$pingTime}ms` : 'Connected';
			case 'connecting':
				return 'Connecting...';
			case 'disconnected':
				return 'Disconnected';
			default:
				return 'Unknown';
		}
	});

	const signalStrength = derived([connectionStatus, pingTime], ([$connectionStatus, $pingTime]) => {
		if ($connectionStatus !== 'connected') return 0;
		console.log('Ping time:', $pingTime);
		if ($pingTime === 0) return 3; // Default to good signal if no ping yet
		if ($pingTime < 100) return 4; // Excellent
		if ($pingTime < 200) return 3; // Good
		if ($pingTime < 500) return 2; // Fair
		return 1; // Poor
	});

	let pingInterval;
	let pingStartTime = 0;

	onMount(() => {
		// Set up ping interval
		pingInterval = setInterval(() => {
			if (io.connected) {
				pingStartTime = Date.now();
				console.log('Sending ping to server', $player.playerId, $socketId);
				io.emit('ping', {
					playerId: $player.playerId,
					socketId: $socketId
				});
			}
		}, 15000); // Send ping every 15 seconds

		// Listen for connection status
		io.on('connect', () => {
			connectionStatus.set('connected');
			console.log('Socket connected');
		});

		io.on('disconnect', () => {
			connectionStatus.set('disconnected');
			console.log('Socket disconnected');
		});

		io.on('connect_error', () => {
			connectionStatus.set('disconnected');
			console.log('Socket connection error');
		});

		// Listen for pong response
		io.on('pong', () => {
			const currentTime = Date.now();
			const ping = currentTime - pingStartTime;
			pingTime.set(ping);
			lastPingTime.set(currentTime);
			console.log('Pong received, ping time:', ping, 'ms');
		});

		// Initial connection status
		if (io.connected) {
			connectionStatus.set('connected');
		}
	});

	onDestroy(() => {
		if (pingInterval) {
			clearInterval(pingInterval);
		}
		io.off('connect');
		io.off('disconnect');
		io.off('connect_error');
		io.off('pong');
	});
</script>

<div
	class="connection-status"
	class:connected={$connectionStatus === 'connected'}
	class:disconnected={$connectionStatus === 'disconnected'}
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
		<!-- <div class="status-indicator" style="background-color: {$statusColor}" /> -->
		<div class="status-text">{$statusText}</div>
	</div>
</div>

<style>
	.connection-status {
		position: fixed;
		bottom: 20px;
		right: 20px;
		background: rgba(255, 255, 255, 0.95);
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 8px 12px;
		display: flex;
		align-items: center;
		gap: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		transition: all 0.3s ease;
		min-width: 60px;
	}

	.connection-status.connected {
		border-color: #4caf50;
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
		background-color: #4caf50;
	}

	.signal-bar.active:nth-child(1) {
		background-color: #f44336;
	}

	.signal-bar.active:nth-child(2) {
		background-color: #ff9800;
	}

	.signal-bar.active:nth-child(3) {
		background-color: #ffc107;
	}

	.signal-bar.active:nth-child(4) {
		background-color: #4caf50;
	}

	.status-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
	}

	.status-text {
		font-size: 12px;
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

	:global(body.dark-mode) .signal-bar {
		background-color: #555;
	}

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
