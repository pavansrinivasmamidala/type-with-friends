import mongoose, { Document, Schema } from 'mongoose';

export interface IPlayer extends Document {
  playerId: string;
  currentWordIndex: number;
  socketId?: string;
  isPartyLeader: boolean;
  WPM: number;
  nickName?: string;
  score: string;
}

const PlayerSchema: Schema = new mongoose.Schema({
  playerId: { type: String, required: true },
  currentWordIndex: {
    type: Number,
    default: 0
  },
  socketId: { type: String },
  isPartyLeader: { type: Boolean, default: false },
  WPM: { type: Number, default: -1 },
  nickName: { type: String },
  score: { type: String }
});

export default mongoose.model<IPlayer>('Player', PlayerSchema); 