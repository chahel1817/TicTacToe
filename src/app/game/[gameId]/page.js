'use client';

import { useState, useEffect } from 'react';
import Board from '../../../../components/Board';

export default function GamePage({ params }) {
  const [gameId, setGameId] = useState('');
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playerId, setPlayerId] = useState('');

  useEffect(() => {
    const getParams = async () => {
      const p = await params;
      setGameId(p.gameId);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!gameId) return;
    const id = localStorage.getItem('playerId');
    if (id) setPlayerId(id);
    fetchGame();
  }, [gameId]);

  useEffect(() => {
    if (!game || game.status === 'finished') return;
    const interval = setInterval(fetchGame, 2000);
    return () => clearInterval(interval);
  }, [gameId, game?.status]);

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
