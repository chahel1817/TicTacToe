'use client';

import { useState, useEffect } from 'react';
import Board from '../../components/Board';

export const metadata = {
  title: 'Game | Tic Tac Toe',
  description: 'Play Tic Tac Toe online with real-time gameplay.',
};

export default function GamePage({ params }) {
  const { gameId } = params;
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playerId, setPlayerId] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('playerId');
    if (id) setPlayerId(id);
    fetchGame();
  }, []);

  const fetchGame = () => {
    fetch(`/api/games/${gameId}`)
      .then(res => res.json())
      .then(setGame)
      .catch(() => setGame(null))
      .finally(() => setLoading(false));
  };

  const handleGameUpdate = (updatedGame) => {
    setGame(updatedGame);
  };

  if (loading) return <div className="container flex justify-center items-center h-64">Loading...</div>;

  if (!game) return <div className="container">Game not found</div>;

  if (!playerId) return <div className="container">Please log in first</div>;

  return (
    <div className="container">
      <div className="header">
        <h1>Game {gameId}</h1>
      </div>
      <Board game={game} playerId={playerId} onGameUpdate={handleGameUpdate} />
    </div>
  );
}
