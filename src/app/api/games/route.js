import connect from '../../../lib/mongodb';
import Game from '../../../models/Game';
import Player from '../../../models/Player';

export async function POST(request) {
  try {
    await connect();
    const { playerId } = await request.json();
    if (!playerId) {
      return Response.json({ error: 'Player ID required' }, { status: 400 });
    }
    const player = await Player.findById(playerId);
    if (!player) {
      return Response.json({ error: 'Player not found' }, { status: 404 });
    }
    const game = new Game({ player1: playerId });
    await game.save();
    return Response.json(game);
  } catch (error) {
    return Response.json({ error: 'Failed to create game' }, { status: 500 });
  }
}
