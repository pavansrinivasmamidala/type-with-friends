/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import Player from './Player.js';

const GameSchema = new mongoose.Schema({
	gameId: { type: String, required: true }, // Add this line

	words: [{ type: String }],
	isOpen: { type: Boolean, default: true },
	isOver: { type: Boolean, default: false },
	playerIds: [{ type: String }],
	chat: [
		{
			playerId: { type: String, required: true },
			playerNick: {type: String},
			message: { type: String }
		}
	],
	startTime: Date,
	endTime: Date
});

export default mongoose.model('Game', GameSchema);