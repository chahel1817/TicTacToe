'use client';

import { useState, useEffect } from 'react';

export const metadata = {
  title: 'Game History | Tic Tac Toe',
  description: 'View your game history and replay past Tic Tac Toe matches.',
};

export default function HistoryPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const playerId = localStorage.getItem('playerId');
    if (playerId) {
      fetch(`/api/history/${playerId}`)
        .then(res => res.json())
        .then(setGames)
        .catch(() => setGames([]))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="container flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="container">
      <div className="header">
        <h1>Game History</h1>
      </div>
      <div className="card">
        <h2 className="text-xl red-text mb-4">Your Games</h2>
        {games.length === 0 ? (
          <p>No games played yet.</p>
        ) : (
          <ul className="space-y-2">
            {games.map(game => (
              <li key={game._id} className="border border-gray-200 p-4 rounded">
                <a href={`/history/${game._id}`} className="red-text hover:underline">
                  Game {game._id} - {game.status} - {game.winner ? 'Winner: ' + game.winner.username : 'Draw'}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
