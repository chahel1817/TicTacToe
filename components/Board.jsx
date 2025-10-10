'use client';

import { useState, useEffect } from 'react';

export default function Board({ game, playerId, onGameUpdate }) {
  const [board, setBoard] = useState(game.board);
  const [currentTurn, setCurrentTurn] = useState(game.currentTurn);
  const [status, setStatus] = useState(game.status);
  const [winner, setWinner] = useState(game.winner);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBoard(game.board);
    setCurrentTurn(game.currentTurn);
    setStatus(game.status);
    setWinner(game.winner);
  }, [game]);

  const handleClick = async (position) => {
    if (status !== 'active' || loading || board[position] !== null) return;
    const symbol = game.player1._id.toString() === playerId ? 'X' : 'O';
    if (symbol !== currentTurn) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/games/${game._id}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, position }),
      });
      if (res.ok) {
        const updatedGame = await res.json();
        onGameUpdate(updatedGame);
      } else {
        alert('Move failed');
      }
    } catch (err) {
      alert('Network error');
    }
    setLoading(false);
  };

  const renderCell = (position) => (
    <div
      key={position}
      className="board-cell"
      onClick={() => handleClick(position)}
    >
      {board[position]}
    </div>
  );

  const getStatusMessage = () => {
    if (status === 'open') return 'Waiting for another player...';
    if (status === 'finished') {
      if (winner) {
        return winner.toString() === playerId ? 'You won!' : 'You lost!';
      }
      return 'It\'s a draw!';
    }
    const isMyTurn = (game.player1._id.toString() === playerId ? 'X' : 'O') === currentTurn;
    return isMyTurn ? 'Your turn' : 'Opponent\'s turn';
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="game-board">
        {board.map((_, index) => renderCell(index))}
      </div>
      <div className="text-center">
        <p className="red-text font-semibold">{getStatusMessage()}</p>
        {loading && <p className="text-gray-600">Making move...</p>}
      </div>
    </div>
  );
}
