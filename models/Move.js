import mongoose from 'mongoose';

const MoveSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  position: { type: Number, required: true, min: 0, max: 8 },
  mark: { type: String, enum: ['X','O'], required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.Move || mongoose.model('Move', MoveSchema);
