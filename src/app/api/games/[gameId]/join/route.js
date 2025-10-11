import connect from '../../../../../lib/mongodb';
import Game from '../../../../../models/Game';
import Player from '../../../../../models/Player';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    await connect();
    const { gameId } = await params;
    const { playerId } = await request.json();

    if (!playerId) {
      return NextResponse.json({ error: 'Player ID required' }, { status: 400 });
    }

    const game = await Game.findById(gameId).populate('player1');
    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    if (game.status !== 'open') {
      return NextResponse.json({ error: 'Game is not open for joining' }, { status: 400 });
    }

    if (game.player1._id.toString() === playerId) {
      return NextResponse.json({ error: 'Cannot join your own game' }, { status: 400 });
    }

    const player = await Player.findById(playerId);
    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    game.player2 = playerId;
    game.status = 'active';
    game.turn = 'X'; // Player1 (X) starts first
    await game.save();

    const updatedGame = await Game.findById(gameId)
      .populate('player1', 'username')
      .populate('player2', 'username');

    return NextResponse.json(updatedGame);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to join game' }, { status: 500 });
  }
}
