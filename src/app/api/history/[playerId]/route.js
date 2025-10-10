import connect from '../../../../lib/mongodb';
import Game from '../../../../models/Game';

export async function GET(request, { params }) {
  try {
    await connect();
    const games = await Game.find({
      $or: [{ player1: params.playerId }, { player2: params.playerId }]
    })
      .populate('player1', 'username')
      .populate('player2', 'username')
      .populate('winner', 'username')
      .sort({ createdAt: -1 });
    return Response.json(games);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
