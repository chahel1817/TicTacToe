import connect from '../../../../lib/mongodb';
import Game from '../../../../models/Game';
import Move from '../../../../models/Move';
import Player from '../../../../models/Player';
import { checkWinner } from '../../../../lib/utils';

export async function POST(request, { params }) {
  try {
    await connect();
    const { playerId, position } = await request.json();
    if (playerId == null || position == null) {
      return Response.json({ error: 'Player ID and position required' }, { status: 400 });
    }
    const game = await Game.findById(params.gameId).populate('player1 player2');
    if (!game) {
      return Response.json({ error: 'Game not found' }, { status: 404 });
    }
    if (game.status !== 'active') {
      return Response.json({ error: 'Game is not active' }, { status: 400 });
    }
    const isPlayer1 = game.player1._id.toString() === playerId;
    const isPlayer2 = game.player2 && game.player2._id.toString() === playerId;
    if (!isPlayer1 && !isPlayer2) {
      return Response.json({ error: 'Player not in game' }, { status: 400 });
    }
    const symbol = isPlayer1 ? 'X' : 'O';
    if (symbol !== game.turn) {
      return Response.json({ error: 'Not your turn' }, { status: 400 });
    }
    if (position < 0 || position > 8 || game.board[position] !== null) {
      return Response.json({ error: 'Invalid move' }, { status: 400 });
    }
    game.board[position] = symbol;
    const move = new Move({ gameId: params.gameId, playerId, position, mark: symbol });
    await move.save();
    const result = checkWinner(game.board);
    if (result.winnerMark) {
      game.status = 'finished';
      game.winner = isPlayer1 ? game.player1._id : game.player2._id;
      game.endedAt = new Date();
      const winnerPlayer = await Player.findById(game.winner);
      const loserPlayer = await Player.findById(isPlayer1 ? game.player2._id : game.player1._id);
      winnerPlayer.wins++;
      loserPlayer.losses++;
      await winnerPlayer.save();
      await loserPlayer.save();
    } else if (result.draw) {
      game.status = 'finished';
      game.endedAt = new Date();
      const player1 = await Player.findById(game.player1._id);
      const player2 = await Player.findById(game.player2._id);
      player1.draws++;
      player2.draws++;
      await player1.save();
      await player2.save();
    } else {
      game.turn = game.turn === 'X' ? 'O' : 'X';
    }
    await game.save();
    const updatedGame = await Game.findById(params.gameId)
      .populate('player1', 'username')
      .populate('player2', 'username')
      .populate('winner', 'username');
    return Response.json(updatedGame);
  } catch (error) {
    return Response.json({ error: 'Failed to make move' }, { status: 500 });
  }
}
