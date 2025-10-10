import connect from '../../lib/mongodb';
import Player from '../../models/Player';
import LeaderBoardTable from '../../components/LeaderBoardTable';

export const metadata = {
  title: 'Leaderboard | Tic Tac Toe',
  description: 'Real-time leaderboard (SSR) showing top players by wins.',
};

export default async function LeaderboardPage() {
  await connect();
  const players = await Player.find().sort({ wins: -1 });
  return (
    <div className="container">
      <div className="header">
        <h1>Leaderboard</h1>
      </div>
      <LeaderBoardTable players={players} />
    </div>
  );
}
