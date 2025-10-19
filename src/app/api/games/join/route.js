import connect from '../../../../../lib/mongodb';
import Game from '../../../../../models/Game';
import Player from '../../../../../models/Player';

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connect();
    const { password, playerId } = await request.json();

    if (!password || !playerId) {
      return NextResponse.json({ error: 'Password and Player ID required' }, { status: 400 });
    }

    const game = await Game.findOne({ password }).populate('player1');
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

    game.player2 = player;
    game.status = 'active';
    await game.save();

    const updatedGame = await Game.findById(game._id)
      .populate('player1', 'username')
      .populate('player2', 'username');

    return NextResponse.json(updatedGame);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to join game' }, { status: 500 });
  }
}
