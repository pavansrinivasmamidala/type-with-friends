import mongoose from 'mongoose';
const PlayerSchema = new mongoose.Schema({
	playerId: { type: String, required: true }, // Add this line
	currentWordIndex: {
		type: Number,
		default: 0
	},
	socketId: { type: String },
	isPartyLeader: { type: Boolean, default: false },
	WPM: { type: Number, default: -1 },
	nickName: { type: String },
    score : {type:String}
});

export default mongoose.model('Player', PlayerSchema);