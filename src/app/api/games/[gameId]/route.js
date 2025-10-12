import connect from '../../../../../lib/mongodb';
import Game from '../../../../../models/Game';
import Player from '../../../../../models/Player';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await connect();
    const { gameId } = await params;
    const game = await Game.findById(gameId)
      .populate('player1', 'username')
      .populate('player2', 'username')
      .populate('winner', 'username');
    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }
    return NextResponse.json(game);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch game' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    await connect();
    const { gameId } = await params;
    const { playerId } = await request.json();
    if (!playerId) {
      return NextResponse.json({ error: 'Player ID required' }, { status: 400 });
    }
    const game = await Game.findById(gameId);
    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }
    if (game.status !== 'open') {
      return NextResponse.json({ error: 'Game is not open for joining' }, { status: 400 });
    }
    if (game.player2) {
      return NextResponse.json({ error: 'Game already has two players' }, { status: 400 });
    }
    const player = await Player.findById(playerId);
    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }
    game.player2 = playerId;
    game.status = 'active';
    await game.save();
    const populatedGame = await Game.findById(gameId)
      .populate('player1', 'username')
      .populate('player2', 'username')
      .populate('winner', 'username');
    return NextResponse.json(populatedGame);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to join game' }, { status: 500 });
  }
}
