import mongoose, { Document, Schema } from 'mongoose';

interface Chat {
  playerId: string;
  playerNick?: string;
  message?: string;
  timestamp?: Date;
}

export interface IGame extends Document {
  gameId: string;
  words: string[];
  isOpen: boolean;
  isOver: boolean;
  playerIds: string[];
  chat: Chat[];
  startTime?: Date;
  endTime?: Date;
}

const GameSchema: Schema = new mongoose.Schema({
  gameId: { type: String, required: true },
  words: [{ type: String }],
  isOpen: { type: Boolean, default: true },
  isOver: { type: Boolean, default: false },
  playerIds: [{ type: String }],
  chat: [
    {
      playerId: { type: String, required: true },
      playerNick: { type: String },
      message: { type: String },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  startTime: Date,
  endTime: Date
});

export default mongoose.model<IGame>('Game', GameSchema); 