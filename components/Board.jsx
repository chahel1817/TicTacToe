'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function Board({ game, playerId, onGameUpdate }) {
  const board = game?.board || [];
  // Determine if it's the player's turn
  const player1Id = game?.player1?._id?.toString() || game?.player1;
  const player2Id = game?.player2?._id?.toString() || game?.player2;
  const isPlayer1 = player1Id === playerId;
  const isPlayer2 = player2Id === playerId;
  const playerSymbol = isPlayer1 ? 'X' : isPlayer2 ? 'O' : null;
  const isPlayerTurn = game?.status === 'active' && game?.turn === playerSymbol;

  const handleMove = async (index) => {
    if (!isPlayerTurn || board[index]) return;

    try {
      const res = await fetch(`/api/games/${game._id}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, position: index }),
      });

      if (res.ok) {
        const updatedGame = await res.json();
        onGameUpdate(updatedGame);
      } else {
        console.error('Move failed');
      }
    } catch (error) {
      console.error('Error making move:', error);
    }
  };

  if (!board || !Array.isArray(board)) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-white text-xl">Loading board...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-white/10">
        {board.map((cell, index) => (
          <motion.div
            key={index}
            whileHover={{
              scale: isPlayerTurn && !cell ? 1.08 : 1,
              boxShadow: isPlayerTurn && !cell
                ? '0px 0px 18px rgba(239, 68, 68, 0.6)'
                : '0px 0px 6px rgba(0,0,0,0.2)',
            }}
            whileTap={{ scale: 0.93 }}
            onClick={() => handleMove(index)}
            className={`w-20 h-20 md:w-24 md:h-24 rounded-xl flex justify-center items-center text-3xl md:text-4xl font-bold cursor-pointer transition-all duration-200 ${
              cell
                ? 'bg-gradient-to-br from-gray-700 to-gray-800 text-white shadow-inner'
                : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 shadow-lg hover:shadow-xl'
            } ${isPlayerTurn && !cell ? 'cursor-pointer' : 'cursor-not-allowed'}`}
          >
            <AnimatePresence>
              {cell && (
                <motion.span
                  key={cell + index}
                  initial={{ scale: 0, rotate: 90, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0, rotate: -90, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 250, damping: 15 }}
                  className={cell === 'X' ? 'text-red-400 drop-shadow-lg' : 'text-blue-400 drop-shadow-lg'}
                >
                  {cell}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
