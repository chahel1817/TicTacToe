import connect from '@lib/mongodb';
import Game from '@models/Game';
import Move from '@models/Move';
import Player from '@models/Player';
import { checkWinner } from '@lib/utils';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    await connect();

    // ✅ Await params
    const { gameId } = await params;
    const { playerId, position } = await request.json();

    console.log('➡️ Move request:', { gameId, playerId, position });

    if (!playerId || position === undefined) {
      return NextResponse.json({ error: 'Player ID and position required' }, { status: 400 });
    }

    // ✅ Find the game
    const game = await Game.findById(gameId).populate('player1 player2');

    console.log('Game found:', game ? { id: game._id, status: game.status, turn: game.turn, board: game.board } : 'null');

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    if (game.status !== 'active') {
      return NextResponse.json({ error: 'Game is not active' }, { status: 400 });
    }

    const isPlayer1 = game.player1._id.toString() === playerId;
    const isPlayer2 = game.player2 && game.player2._id.toString() === playerId;

    console.log('Players:', { isPlayer1, isPlayer2, player1Id: game.player1._id.toString(), player2Id: game.player2 ? game.player2._id.toString() : null });

    if (!isPlayer1 && !isPlayer2) {
      return NextResponse.json({ error: 'Player not in game' }, { status: 400 });
    }

    const symbol = isPlayer1 ? 'X' : 'O';

    console.log('Symbol and turn:', { symbol, gameTurn: game.turn });

    if (symbol !== game.turn) {
      return NextResponse.json({ error: 'Not your turn' }, { status: 400 });
    }

    console.log('Board position:', { position, boardValue: game.board[position] });

    if (position < 0 || position > 8 || game.board[position] !== null) {
      return NextResponse.json({ error: 'Invalid move' }, { status: 400 });
    }

    // ✅ Make the move
    game.board = [...game.board]; // Ensure it's a plain array
    game.board[position] = symbol;
    game.markModified('board'); // Mark board as modified
    console.log('After setting board:', game.board);

    const move = new Move({ gameId, playerId, position, mark: symbol });
    await move.save();

    // ✅ Use safe checkWinner result
    const result = checkWinner(game.board) || {};
    console.log('Check winner result:', result);

    if (result.winnerMark) {
      // ✅ Game won
      game.status = 'finished';
      game.winner = isPlayer1 ? game.player1._id : game.player2._id;
      game.endedAt = new Date();

      const winnerPlayer = await Player.findById(game.winner);
      const loserPlayer = await Player.findById(isPlayer1 ? game.player2._id : game.player1._id);

      if (winnerPlayer && loserPlayer) {
        winnerPlayer.wins++;
        loserPlayer.losses++;
        await winnerPlayer.save();
        await loserPlayer.save();
      }

    } else if (result.draw) {
      // ✅ Game draw
      game.status = 'finished';
      game.endedAt = new Date();

      const player1 = await Player.findById(game.player1._id);
      const player2 = await Player.findById(game.player2._id);

      if (player1 && player2) {
        player1.draws++;
        player2.draws++;
        await player1.save();
        await player2.save();
      }

    } else {
      // ✅ Continue game
      game.turn = game.turn === 'X' ? 'O' : 'X';
    }

    await game.save();

    // ✅ Return updated game
    const updatedGame = await Game.findById(gameId)
      .populate('player1', 'username wins losses draws')
      .populate('player2', 'username wins losses draws')
      .populate('winner', 'username');

    console.log('✅ Move successful, updated game:', {
      id: updatedGame._id,
      status: updatedGame.status,
      turn: updatedGame.turn,
      winner: updatedGame.winner?.username || null,
    });

    return NextResponse.json(updatedGame);
  } catch (error) {
    console.error('❌ Error in POST /move:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to make move' },
      { status: 500 }
    );
  }
}
