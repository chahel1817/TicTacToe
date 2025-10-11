import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
  player1: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  player2: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  status: { type: String, enum: ['open','active','finished'], default: 'open' },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null },
  board: { type: [String], default: Array(9).fill(null) }, // "X", "O", or null
  turn: { type: String, enum: ['X','O'], default: 'X' },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  endedAt: { type: Date, default: null }
});

export default mongoose.models.Game || mongoose.model('Game', GameSchema);
