<script>
	import io from 'socket.io-client';

	const socket = io('http://localhost:3001');
	console.log('multiplayer is loaded');

	function socketFunction() {
		socket.emit('message', 'test input');
	}
</script>

<div class="container">
	<div class="game-info">
		<div>Owner Name</div>

		<div>copy link</div>
	</div>

	<div class="game-options">
		<div class="chat-window">chat window</div>
		<div>
			<ul>
				<li>Option 1</li>
				<li>Option 2</li>
			</ul>
			<ul>
				<li>Player 1</li>
				<li>Player 2</li>
				<li>Player 3</li>
			</ul>
            <button>Start Game</button>
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
		border: 1px solid black;
		padding: 20px;
		width: 600px;
	}

	.game-options {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.chat-window {
		height: 200px;
		border: 1px solid black;
		width: 400px;
		margin: 30px;
		padding: 30px;
	}
</style>
