const express = require('express');
const app = express();
const socketio = require('socket.io');
const mongoose = require('mongoose');

const expressServer = app.listen(3001);
const io = socketio(expressServer);

const uri = 'mongodb+srv://admin:iluv@1d@cluster0.ej4gm.mongodb.net/?retryWrites=true&w=majority';

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


const PlayerSchema = new mongoose.Schema({
    currentWordIndex : {
        type: Number,
        default : 0
    },
    socketID : {type : String},
    isPartyLeader : {type : Boolean,default : false},
    WPM : {type : Number, default: -1},
    nickName : {type : String}
});

const GameSchema = new mongoose.Schema({
    words : [{type : String}],
    isOpen : {type : Boolean,default : true},
    isOver : {type : Boolean,default : false},
    players : [PlayerSchema],
    startTime : {type : Number}
});

const Game = mongoose.model('Game',GameSchema);

io.on('connection', (socket) => {
	console.log('connected to a user');
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	socket.on('message', (msg) => {
		let game = new Game();

        game.words.push(msg);

        console.log(game);
	});
});
