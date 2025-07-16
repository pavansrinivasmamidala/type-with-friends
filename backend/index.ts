import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import Game from './schemas/Game';
import Player from './schemas/Player';
import createNewGame from './utils/create-new-game';
import createNewPlayer from './utils/create-new-player';

const app = express();
const server = createServer(app).listen(3001, () => {
	console.log('server is running on port 3001');
});

const uri =
	'mongodb://127.0.0.1:27017/typesmash?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4';

mongoose.connect(
	uri,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	} as ConnectOptions,
	() => {
		console.log('db connected');
	}
);

const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST']
	}
});

// Store active players and their last ping time
const activePlayers = new Map<string, { socketId: string; lastPing: number; playerId: string }>();

// Ping system to check player activity
const PING_INTERVAL = 15000; // 15 seconds
const PING_TIMEOUT = 100000; // 100 seconds (3 missed pings)

setInterval(async () => {
	const now = Date.now();
	const inactivePlayers = [];

	const activePlayerCount = Array.from(activePlayers.values()).filter((p) => p.playerId).length;
	const activePlayerIds = (await Player.find({ socketId: { $ne: '' } })).map((p) => p.playerId).length;
	console.log(
		`Ping check: ${activePlayers.size} total sockets, ${activePlayerIds} active players with IDs`
	);

	// Check for inactive players
	for (const [socketId, playerData] of activePlayers.entries()) {
		const timeSinceLastPing = now - playerData.lastPing;
		if (timeSinceLastPing > PING_TIMEOUT) {
			console.log(
				`Player ${
					playerData.playerId || 'Unknown'
				} inactive for ${timeSinceLastPing}ms, marking for removal`
			);
			inactivePlayers.push({ socketId, playerData });
		}
	}

	// Handle inactive players
	for (const { socketId, playerData } of inactivePlayers) {
		console.log('Player inactive, removing:', playerData.playerId || 'Unknown');

		// Remove from active players
		activePlayers.delete(socketId);

		// Only process games if player has a valid playerId
		if (!playerData.playerId) {
			console.log('Skipping game removal for player without ID');
			continue;
		}

		// Find all games where this player is participating
		const games = await Game.find({ playerIds: playerData.playerId });

		for (const game of games) {
			console.log('Removing inactive player from game:', game.gameId);

			// Remove player from the game
			game.playerIds = game.playerIds.filter((id) => id !== playerData.playerId);
			await game.save();

			// Emit to all other players in the game room
			io.to(game.gameId).emit('player-left', {
				playerId: playerData.playerId,
				gameId: game.gameId,
				reason: 'inactive',
				playerNick: 'Unknown Player'
			});

			// If no players left, delete the game
			if (game.playerIds.length === 0) {
				await Game.deleteOne({ gameId: game.gameId });
				console.log('Game deleted (no players left after inactivity):', game.gameId);
				io.to(game.gameId).emit('game-deleted', { gameId: game.gameId });
			}
		}

		// Clear the socket ID from the player record
		await Player.findOneAndUpdate(
			{ playerId: playerData.playerId },
			{ socketId: '' },
			{ new: true }
		);
	}
}, PING_INTERVAL);

io.on('connection', (socket: Socket) => {
	console.log('connected to a user', socket.id);

	// Add socket to active players immediately upon connection
	// We'll update the playerId later when we get it
	activePlayers.set(socket.id, { socketId: socket.id, lastPing: Date.now(), playerId: '' });
	console.log('Added socket to active players:', socket.id);

	socket.on('new-player', async (data: any) => {
		console.log('adding a new player');

		let player = await createNewPlayer(data);

		player.isPartyLeader = data?.partyLeader;
		player.socketId = data?.socketId;
		player?.save((err: any, player: any) => {
			if (err) console.error(err);
			else {
				console.log('Player created with socket ID:', player.socketId);
				socket.emit('new-player', player);
			}
		});
	});

	socket.on('update-socket-id', async (data: any) => {
		console.log('updating socket ID for player:', data);

		try {
			const { playerId, socketId } = data;

			// Update the player's socket ID in the database
			await Player.findOneAndUpdate({ playerId: playerId }, { socketId: socketId }, { new: true });

			// Update existing active player entry with playerId
			const existingPlayer = activePlayers.get(socketId);
			if (existingPlayer) {
				existingPlayer.playerId = playerId;
				existingPlayer.lastPing = Date.now();
				console.log('Updated active player with playerId:', playerId, 'Socket:', socketId);
			} else {
				// Fallback: create new entry if somehow not exists
				activePlayers.set(socketId, { socketId, lastPing: Date.now(), playerId });
				console.log('Created new active player entry:', playerId, 'Socket:', socketId);
			}

			console.log('Updated socket ID for player:', playerId, 'to:', socketId);
		} catch (error) {
			console.error('Error updating socket ID:', error);
		}
	});

	socket.on('new-game', async (data: any) => {
		let game = await createNewGame();

		console.log('new game', data);
		game?.playerIds?.push(data.playerId);

		game?.save(async (err: any, game: any) => {
			if (err) console.error(err);
			else {
				console.log('game created', game);
				socket.emit('game-created', game);
			}
		});
	});

	socket.on('join-game', async (data: any) => {
		console.log('player joining game:', data);

		try {
			const { gameId, playerId } = data;

			// Find the game by gameId
			const game = await Game.findOne({ gameId: gameId });

			if (!game) {
				console.error('Game not found:', gameId);
				socket.emit('join-game-error', { message: 'Game not found' });
				return;
			}

			// Check if player is already in the game
			if (game.playerIds.includes(playerId)) {
				console.log('Player already in game');
				socket.emit('joined-game', game);
				return;
			}

			// Add player to the game
			game.playerIds.push(playerId);

			// Save the updated game
			await game.save();

			// Join the socket room for this game
			socket.join(gameId);

			// Update active player entry with playerId if not already set
			const existingPlayer = activePlayers.get(socket.id);
			if (existingPlayer && !existingPlayer.playerId) {
				existingPlayer.playerId = playerId;
				existingPlayer.lastPing = Date.now();
				console.log('Updated active player in join-game:', playerId, 'Socket:', socket.id);
			}

			console.log('Player joined game:', gameId, 'Player:', playerId);

			// Emit to the joining player
			socket.emit('joined-game', game);

			// Emit to all other players in the game room (excluding the joining player)
			socket.to(gameId).emit('player-joined', { playerId, gameId });
		} catch (error) {
			console.error('Error joining game:', error);
			socket.emit('join-game-error', { message: 'Failed to join game' });
		}
	});

	socket.on('leave-game', async (data: any) => {
		console.log('player leaving game:', data);

		try {
			const { gameId, playerId } = data;

			// Find the game by gameId
			const game = await Game.findOne({ gameId: gameId });

			if (!game) {
				console.error('Game not found:', gameId);
				return;
			}

			// Remove player from the game
			game.playerIds = game.playerIds.filter((id) => id !== playerId);

			// Save the updated game
			await game.save();

			// Leave the socket room
			socket.leave(gameId);

			// Remove from active players
			activePlayers.delete(socket.id);

			console.log('Player left game:', gameId, 'Player:', playerId);

			// Emit to all other players in the game room
			socket.to(gameId).emit('player-left', { playerId, gameId });

			// If no players left, delete the game
			if (game.playerIds.length === 0) {
				await Game.deleteOne({ gameId: gameId });
				console.log('Game deleted (no players left):', gameId);
				io.to(gameId).emit('game-deleted', { gameId });
			}
		} catch (error) {
			console.error('Error leaving game:', error);
		}
	});

	// Handle ping from client
	socket.on('ping', (data: any) => {
		const playerData = activePlayers.get(socket.id);
		if (playerData) {
			playerData.lastPing = Date.now();

			// Update playerId if provided and not already set
			if (data.playerId && !playerData.playerId) {
				playerData.playerId = data.playerId;
				console.log('Updated playerId from ping:', data.playerId, 'Socket:', socket.id);
			}

			socket.emit('pong');
			// console.log(
			// 	'Ping received from player:',
			// 	playerData.playerId || 'Unknown',
			// 	'Socket:',
			// 	socket.id
			// );
		} else {
			console.log('Ping received from unknown socket:', socket.id);
		}
	});

	socket.on('send-message', async (data: any) => {
		console.log('received message event');
		console.log(data);

		try {
			const result = await Game.findOneAndUpdate(
				{ gameId: data.gameId },
				{
					$push: {
						chat: {
							playerId: data.playerId,
							playerNick: data.playerNick,
							message: data.message,
							timestamp: data.timestamp
						}
					}
				},
				{ new: true }
			);

			if (result) {
				console.log('updated game ', result);
				const latestMessage = result.chat[result.chat.length - 1];

				// Emit the message to ALL players in the game room (including sender)
				io.to(data.gameId).emit('get-messages', {
					playerId: latestMessage.playerId,
					playerNick: latestMessage.playerNick,
					message: latestMessage.message,
					timestamp: latestMessage.timestamp
				});
			} else {
				console.error('Game not found for message:', data.gameId);
			}
		} catch (error) {
			console.error('Error saving message:', error);
		}
	});

	socket.on('get-players', async (data: any) => {
		try {
			const game = await Game.findOne({ gameId: data.gameId });
			if (game) {
				const players = await Player.find({ playerId: { $in: game.playerIds } });
				console.log('Players in the game:', players);
				socket.emit('players', players);
			} else {
				console.error('Game not found');
				socket.emit('players', []);
			}
		} catch (error) {
			console.error('Error fetching players:', error);
			socket.emit('players', []);
		}
	});

	Game.watch([{ $match: { 'updateDescription.updatedFields.playerIds': { $exists: true } } }]).on(
		'change',
		async (change) => {
			try {
				const gameId = change._id;
				const updatedGame = await Game.findById(gameId);

				if (updatedGame) {
					// Fetch updated players data
					const players = await Player.find({ playerId: { $in: updatedGame.playerIds } });
					console.log('Updated players in the game:', players);

					// Emit updated players data to all players in the game room
					io.to(updatedGame.gameId).emit('players', players);
				} else {
					console.error('Game not found for emitting updated players:', gameId);
				}
			} catch (error) {
				console.error('Error emitting updated players:', error);
			}
		}
	);

	async function updatePlayerSocketId(playerId: string, newSocketId: string) {
		try {
			await Player.findOneAndUpdate(
				{ playerId: playerId },
				{ socketId: newSocketId },
				{ new: true }
			);
			console.log('Updated socket ID for player:', playerId, 'to:', newSocketId);
			return true;
		} catch (error) {
			console.error('Error updating socket ID:', error);
			return false;
		}
	}

	socket.on('disconnect', async () => {
		console.log('user disconnected - socket ID:', socket.id);

		// Remove from active players
		activePlayers.delete(socket.id);

		try {
			// Find the player by socketId first
			const player = await Player.findOne({ socketId: socket.id });

			if (!player) {
				console.log('No player found for disconnected socket:', socket.id);
				return;
			}

			console.log('Player disconnecting:', player.nickName, 'Player ID:', player.playerId);

			// Find all games where this player is participating
			const games = await Game.find({ playerIds: player.playerId });

			for (const game of games) {
				console.log('Removing player from game:', game.gameId);

				// Remove player from the game
				game.playerIds = game.playerIds.filter((id) => id !== player.playerId);
				await game.save();

				// Leave the socket room
				socket.leave(game.gameId);

				console.log(
					'Player removed from game on disconnect:',
					player.playerId,
					'Game:',
					game.gameId
				);

				// Emit to all other players in the game room
				socket.to(game.gameId).emit('player-left', {
					playerId: player.playerId,
					gameId: game.gameId,
					reason: 'disconnected',
					playerNick: player.nickName
				});

				// If no players left, delete the game
				if (game.playerIds.length === 0) {
					await Game.deleteOne({ gameId: game.gameId });
					console.log('Game deleted (no players left after disconnect):', game.gameId);
					io.to(game.gameId).emit('game-deleted', { gameId: game.gameId });
				}
			}

			// Clear the socket ID from the player record
			await updatePlayerSocketId(player.playerId, '');
		} catch (error) {
			console.error('Error handling disconnect:', error);
		}
	});
});

const wordsArray: any[] = [];
let word: any[] = [];
