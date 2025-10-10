import connect from '../../../../lib/mongodb';
import Game from '../../../../models/Game';
import Player from '../../../../models/Player';

export async function GET(request, { params }) {
  try {
    await connect();
    const game = await Game.findById(params.gameId)
      .populate('player1', 'username')
      .populate('player2', 'username')
      .populate('winner', 'username');
    if (!game) {
      return Response.json({ error: 'Game not found' }, { status: 404 });
    }
    return Response.json(game);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch game' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    await connect();
    const { playerId } = await request.json();
    if (!playerId) {
      return Response.json({ error: 'Player ID required' }, { status: 400 });
    }
    const game = await Game.findById(params.gameId);
    if (!game) {
      return Response.json({ error: 'Game not found' }, { status: 404 });
    }
    if (game.status !== 'open') {
      return Response.json({ error: 'Game is not open for joining' }, { status: 400 });
    }
    if (game.player2) {
      return Response.json({ error: 'Game already has two players' }, { status: 400 });
    }
    const player = await Player.findById(playerId);
    if (!player) {
      return Response.json({ error: 'Player not found' }, { status: 404 });
    }
    game.player2 = playerId;
    game.status = 'active';
    game.turn = 'O'; // Player1 X, Player2 O
    await game.save();
    const populatedGame = await Game.findById(params.gameId)
      .populate('player1', 'username')
      .populate('player2', 'username')
      .populate('winner', 'username');
    return Response.json(populatedGame);
  } catch (error) {
    return Response.json({ error: 'Failed to join game' }, { status: 500 });
  }
}
