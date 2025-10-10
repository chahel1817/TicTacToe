'use client';

export default function LeaderBoardTable({ players }) {
  const sortedPlayers = players.sort((a, b) => b.wins - a.wins);

  return (
    <div className="card">
      <h2 className="text-xl red-text mb-4">Leaderboard</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="text-left p-2">Player</th>
            <th className="text-center p-2">Wins</th>
            <th className="text-center p-2">Losses</th>
            <th className="text-center p-2">Draws</th>
            <th className="text-center p-2">Win Rate</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player) => {
            const total = player.wins + player.losses + player.draws;
            const winRate = total > 0 ? ((player.wins / total) * 100).toFixed(1) : 0;
            return (
              <tr key={player._id} className="border-b border-gray-200">
                <td className="p-2 font-semibold">{player.username}</td>
                <td className="text-center p-2">{player.wins}</td>
                <td className="text-center p-2">{player.losses}</td>
                <td className="text-center p-2">{player.draws}</td>
                <td className="text-center p-2">{winRate}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
