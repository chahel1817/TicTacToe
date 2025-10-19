'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xl">Loading game...</p>
        </motion.div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-red-400 mb-4">Game Not Found</h1>
          <p className="text-gray-300">The game you're looking for doesn't exist.</p>
        </motion.div>
      </div>
    );
  }

  if (!playerId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-red-400 mb-4">Please Log In</h1>
          <p className="text-gray-300">You need to be logged in to play.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center px-6 py-12">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-extrabold text-red-400 mb-2 tracking-tight drop-shadow-lg">
          Game Room
        </h1>
        <p className="text-gray-300 text-lg">
          Game ID: <span className="font-semibold text-red-300">{gameId}</span>
        </p>
        {game.status === 'finished' && (
          <div className="text-gray-400 text-md mt-2">
            <p className="mb-2">
              Winner: <span className="font-semibold text-yellow-400">
                {game.winner ? game.winner.username : 'Draw'}
              </span>
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            >
              New Game
            </button>
          </div>
        )}
      </motion.div>

      {/* Game Status */}
      <motion.div
        className="mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <p className="text-gray-300">
          Status: <span className={`font-semibold ${game.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
            {game.status === 'active' ? 'In Progress' : 'Finished'}
          </span>
        </p>
        {game.status === 'active' && (
          <p className="text-gray-300 mt-1">
            Current Turn: <span className="font-semibold text-blue-400">
              {(() => {
                const player1Id = game.player1?._id?.toString() || game.player1;
                const player2Id = game.player2?._id?.toString() || game.player2;
                const playerSymbol = player1Id === playerId ? 'X' : player2Id === playerId ? 'O' : null;
                return game.turn === playerSymbol ? 'Your Turn' : 'Opponent\'s Turn';
              })()}
            </span>
          </p>
        )}
      </motion.div>

      {/* Board */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Board game={game} playerId={playerId} onGameUpdate={handleGameUpdate} />
      </motion.div>

      {/* Footer */}
      <footer className="mt-12 text-gray-500 text-sm text-center">
        <p>
          © {new Date().getFullYear()}{' '}
          <span className="text-red-400 font-semibold">Tic-Tac-Toe Arena</span>.
          Enjoy the game!
        </p>
      </footer>
    </div>
  );
}
