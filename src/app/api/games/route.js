import connect from '../../../../lib/mongodb';
import Game from '../../../../models/Game';
import Player from '../../../../models/Player';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connect();
    const { playerId } = await request.json();
    if (!playerId) {
      return NextResponse.json({ error: 'Player ID required' }, { status: 400 });
    }
    const player = await Player.findById(playerId);
    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }
    const game = new Game({ player1: playerId, password: Math.random().toString(36).substring(2,8) });
    await game.save();
    return NextResponse.json(game);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
  }
}
