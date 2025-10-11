import connect from '../../../../../lib/mongodb';
import Game from '../../../../../models/Game';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connect();
    const games = await Game.find({ status: 'open' }).populate('player1', 'username');
    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch open games' }, { status: 500 });
  }
}
