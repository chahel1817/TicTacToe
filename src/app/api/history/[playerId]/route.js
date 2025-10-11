import connect from '../../../../../lib/mongodb';
import Game from '../../../../../models/Game';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await connect();
    const { playerId } = await params;
    const games = await Game.find({
      $or: [{ player1: playerId }, { player2: playerId }]
    })
      .populate('player1', 'username')
      .populate('player2', 'username')
      .populate('winner', 'username')
    .sort({ createdAt: -1 });
    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
