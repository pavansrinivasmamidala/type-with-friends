/* eslint-disable no-unused-vars */
const express = require('express');

const Game = require('./schemas/Game');
const Player = require('./schemas/Player');
const app = express();
const http = require('http');
const server = http.createServer(app);
const mongoose = require('mongoose');
server.listen(3001);
const { Server } = require('socket.io');
const uri =
	'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4';

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

		let player = new Player();

		player.nickName = data.nickName;
		player.isPartyLeader = data.partyLeader;
		player.save((err, player) => {
			if (err) console.err(err);
			else {
				console.log(player);
				socket.emit('new-player', player);
			}
		});
	});

	socket.on('new-game', async (data) => {
		let game = new Game();

		console.log(data);

		game.players.push(data);

		game.save(async (err, game) => {
			if (err) console.err(err);
			else {
				console.log(game);
				socket.emit('game-created', game);
			}
		});
	});

	socket.on('get-players', async (data) => {
		const game = await Game.findById(data.gameId).exec();

		const players = await Promise.all(
			game.players.map(async (playerId) => {
				const player = await Player.findById(playerId).exec();
				return player;
			})
		);
		console.log('found players:', players);

		socket.emit('players', players);
	});

	socket.on('message', async (data) => {
		console.log('message event is emitted');
		console.log(data);

		// let game = Game.findById(data.gameId);
		// console.log(game);

		Game.findOneAndUpdate(
			{
				_id: data.gameId
			},
			{ $push: { chat: { playerId: data.playerId, message: data.message } } },
			{ new: true },
			(err, result) => {
				if (err) console.error(err);
				else {
					console.log('updated game ', result);
					socket.emit('message', result.chat);
				}
			}
		);
		//game.chat.push({playerId: data.playerId, message: data.message});

		//game = await game.save();
	});

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
