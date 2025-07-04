/* eslint-disable no-unused-vars */
import express from 'express';

import Game from './schemas/Game.js';
import Player from './schemas/Player.js';
import createNewGame from './utils/create-new-game.js';
import createNewPlayer from './utils/create-new-player.js';
const app = express();
import { createServer } from 'http';
const server = createServer(app);
import mongoose from 'mongoose';

server.listen(3001);
import { Server } from 'socket.io';
const uri =
	'mongodb://127.0.0.1:27017/typesmash?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4';

mongoose.connect(
	uri,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
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

io.on('connection', (socket) => {
	console.log('connected to a user');

	socket.on('new-player', async (data) => {
		console.log('adding a new player');

		let player = await createNewPlayer(data);

		player.nickName = data?.nickName;
		player.isPartyLeader = data?.partyLeader;
		player.socketId = data?.socketId;
		player?.save((err, player) => {
			if (err) console.err(err);
			else {
				console.log(player);
				socket.emit('new-player', player);
			}
		});
	});

	socket.on('new-game', async (data) => {
		let game = await createNewGame();

		console.log('new game', data);
		// if (mongoose.Types.ObjectId.isValid(data)) {
		game.playerIds?.push(data.playerId);
		// } else {
		// console.error('Invalid ObjectId:', data);
		// Handle the error, e.g., send an error message back to the client
		// socket.emit('error', 'Invalid player ID');
		// return;
		// }

		// game.players.push(data);

		console.log('game is created', game);

		game?.save(async (err, game) => {
			if (err) console.error(err);
			else {
				console.log('game created', game);
				socket.emit('game-created', game);
			}
		});
	});

	// socket.on('get-players', async (data) => {
	// 	const game = await Game.findOne({ gameId: data.gameId }).exec();

	// 	if (!game) {
	// 		console.error('Game not found');
	// 		socket.emit('error', 'Game not found');
	// 		return;
	// 	}

	// 	const players = await Promise.all(
	// 		game.players.map(async (playerId) => {
	// 			const player = await findById(playerId).exec();
	// 			return player;
	// 		})
	// 	);
	// 	console.log('found players:', players);

	// 	socket.emit('players', players);
	// });

	// socket.on('message', async (data) => {
	// 	console.log('message event is emitted');
	// 	console.log(data);

	// 	findOneAndUpdate(
	// 		{ gameId: data.gameId },
	// 		{ $push: { chat: { playerId: data.playerId, playerNick: data.playerNick, message: data.message } } },
	// 		{ new: true },
	// 		(err, result) => {
	// 			if (err) console.error(err);
	// 			else {
	// 				console.log('updated game ', result);
	// 				socket.emit('message', result.chat);
	// 			}
	// 		}
	// 	);
	// 	//game.chat.push({playerId: data.playerId, message: data.message});

	// 	//game = await game.save();
	// });

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

const wordsArray = [];
let word = [];

// fetch('https://api.quotable.io/random?minLength=250&maxLength=280').then(
//             response => response.json()
//         ).then(data => {

//             data.content.split('').map((item) => {
//                 word.push({
//                     text:item,
//                     isActive: false,
//                     isWrong:false
//                 });
//                 if(item == ' '){
//                     wordsArray.push(word);
//                     word = [];
//                 }

//             })
//         }).catch(err => {
//             console.log(err);
//         });

// app.get('/', (req,res) => {
//     console.log('get req is made');
//     res.send('is this working');
// })
