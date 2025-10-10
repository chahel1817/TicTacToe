import connect from '../../../lib/mongodb';
import Player from '../../../models/Player';

export async function GET() {
  try {
    await connect();
    const players = await Player.find({});
    return Response.json(players);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch players' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connect();
    const { username } = await request.json();
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      return Response.json({ error: 'Invalid username' }, { status: 400 });
    }
    const existing = await Player.findOne({ username: username.trim() });
    if (existing) {
      return Response.json({ error: 'Username already taken' }, { status: 400 });
    }
    const player = new Player({ username: username.trim() });
    await player.save();
    return Response.json(player);
  } catch (error) {
    return Response.json({ error: 'Failed to create player' }, { status: 500 });
  }
}
