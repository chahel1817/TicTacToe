'use client';

import { useState, useEffect } from 'react';
import CreateJoinForm from '../../components/CreateJoinForm';
import { motion } from 'framer-motion';

export default function Home() {
  const [currentPlayer, setCurrentPlayer] = useState(null);

  // 🔁 Restore player from localStorage
  useEffect(() => {
    const fetchPlayer = async () => {
      const playerId = localStorage.getItem('playerId');
      if (playerId) {
        try {
          const res = await fetch(`/api/players/${playerId}`);
          if (res.ok) {
            const player = await res.json();
            setCurrentPlayer(player);
          }
        } catch (err) {
          console.error('Failed to load player');
        }
      }
    };
    fetchPlayer();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center px-6 py-12">
      {/* Header */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-extrabold text-red-400 mb-3 tracking-tight drop-shadow-lg">
          Welcome to Tic-Tac-Toe!
        </h1>

        {currentPlayer ? (
          <p className="text-gray-300 text-lg mt-2">
            Logged in as:{' '}
            <span className="font-semibold text-red-300">
              {currentPlayer.username}
            </span>{' '}
            🎮
          </p>
        ) : (
          <p className="text-gray-400 text-md mt-2 italic">
            Create or join a game to get started!
          </p>
        )}
      </motion.div>

      {/* Create / Join Form */}
      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-2xl border border-white/10 hover:shadow-2xl transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <CreateJoinForm
          currentPlayer={currentPlayer}
          setCurrentPlayer={setCurrentPlayer}
        />
      </motion.div>

      {/* Info Section */}
      <motion.div
        className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {/* Quick Start */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-[1.02]">
          <h2 className="text-2xl font-semibold text-red-400 mb-4">
            🚀 Quick Start
          </h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Create a player, start a new game, or join an existing one to play
            Tic-Tac-Toe in real-time with your friends.
          </p>
          <button
            onClick={() => {
              document
                .querySelector('input[placeholder="Enter your name"]')
                ?.focus();
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-transform hover:-translate-y-1"
          >
            Create New Player
          </button>
        </div>

        {/* Features */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-[1.02]">
          <h2 className="text-2xl font-semibold text-red-400 mb-4">
            💡 Features
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>Multiplayer with live updates</li>
            <li>Secure MongoDB Atlas backend</li>
            <li>Leaderboard & game history</li>
            <li>Instant room creation with password</li>
            <li>Responsive design + animations</li>
          </ul>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="mt-16 text-gray-500 text-sm text-center">
        <p>
          © {new Date().getFullYear()}{' '}
          <span className="text-red-400 font-semibold">Tic-Tac-Toe Arena</span>.
          Built with ❤️ using Next.js & MongoDB.
        </p>
      </footer>
    </div>
  );
}
