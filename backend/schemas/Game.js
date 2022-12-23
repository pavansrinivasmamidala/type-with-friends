/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const Player = require('./Player');


const GameSchema = new mongoose.Schema({
	words: [{ type: String }],
	isOpen: { type: Boolean, default: true },
	isOver: { type: Boolean, default: false },
	players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }],
	chat: [
		{
			playerId: { type: mongoose.Types.ObjectId },
			message: { type: String }
		}
	],
	startTime: { type: Number }
});

module.exports = mongoose.model('Game', GameSchema);
