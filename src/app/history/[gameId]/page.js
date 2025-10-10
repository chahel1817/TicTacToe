'use client';

import { useState, useEffect } from 'react';

export const metadata = {
  title: 'Game Replay | Tic Tac Toe',
  description: 'Replay a past Tic Tac Toe game move by move.',
};

export default function HistoryGamePage({ params }) {
  const { gameId } = params;
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/games/${gameId}`)
      .then(res => res.json())
      .then(setGame)
      .catch(() => setGame(null))
      .finally(() => setLoading(false));
  }, [gameId]);

  if (loading) return <div className="container flex justify-center items-center h-64">Loading...</div>;

  if (!game) return <div className="container">Game not found</div>;

  const renderBoard = () => (
    <div className="game-board">
      {game.board.map((cell, index) => (
        <div key={index} className="board-cell">
          {cell}
        </div>
      ))}
    </div>
  );

  return (
    <div className="container">
      <div className="header">
        <h1>Game Replay {gameId}</h1>
      </div>
      <div className="card">
        <h2 className="text-xl red-text mb-4">Final Board</h2>
        {renderBoard()}
        <div className="mt-4">
          <p><strong>Status:</strong> {game.status}</p>
          {game.winner && <p><strong>Winner:</strong> {game.winner.username}</p>}
          <p><strong>Players:</strong> {game.player1.username}, {game.player2.username}</p>
        </div>
      </div>
    </div>
  );
}
