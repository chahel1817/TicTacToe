'use client';

import { useState } from 'react';
import CreateJoinForm from '../components/CreateJoinForm';

export const metadata = {
  title: 'Tic Tac Toe Multiplayer | Home',
  description: 'Create or join a Tic Tac Toe game with friends. Play online with real-time updates.',
};

export default function Home() {
  const [currentPlayer, setCurrentPlayer] = useState(null);

  return (
    <div className="container">
      <div className="header">
        <h1 className="text-3xl font-bold red-text mb-2">Welcome to Tic-Tac-Toe!</h1>
        {currentPlayer && (
          <p className="red-text">Logged in as: <span className="font-semibold">{currentPlayer.username}</span></p>
        )}
      </div>
      <div className="card">
        <CreateJoinForm currentPlayer={currentPlayer} setCurrentPlayer={setCurrentPlayer} />
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl red-text mb-4">Quick Start</h2>
          <p className="mb-4">Create a player and start a new game or join an existing one to play with friends.</p>
          <button className="primary-button">Create New Player</button>
        </div>
        <div className="card">
          <h2 className="text-xl red-text mb-4">Features</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Multiplayer games with real-time updates</li>
            <li>Leaderboard tracking wins, losses, and draws</li>
            <li>Complete game history and replay functionality</li>
            <li>Secure MongoDB Atlas backend</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
