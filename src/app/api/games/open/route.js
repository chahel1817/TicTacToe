import connect from '../../../../lib/mongodb';
import Game from '../../../../models/Game';

export async function GET() {
  try {
    await connect();
    const games = await Game.find({ status: 'open' }).populate('player1', 'username');
    return Response.json(games);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch open games' }, { status: 500 });
  }
}
