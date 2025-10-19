'use client';

import { useState } from 'react';

export default function CreateJoinForm({ currentPlayer, setCurrentPlayer }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [gameId, setGameId] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  // 🧍 Create player
  const createPlayer = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setError('');
    try {
      const res = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name.trim() }),
      });
      if (res.ok) {
        const player = await res.json();
        localStorage.setItem('playerId', player._id);
        setCurrentPlayer(player);
        setName('');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create player');
      }
    } catch (err) {
      setError('Network error');
    }
    setCreating(false);
  };

  // 🎮 Create game
  const createGame = async (e) => {
    e.preventDefault();
    if (!currentPlayer) return;
    setCreating(true);
    setError('');
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: currentPlayer._id }),
      });
      if (res.ok) {
        const game = await res.json();
        setPassword(game.password);
        setGameId(game._id);
      } else {
        setError('Failed to create game');
      }
    } catch (err) {
      setError('Network error');
    }
    setCreating(false);
  };

  // 🧩 If player not created
  if (!currentPlayer) {
    return (
      <form onSubmit={createPlayer} className="space-y-4">
        <h2 className="text-xl font-semibold text-red-400 mb-2">
          Create Player
        </h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-white/20 rounded-md bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={creating}
          className="w-full px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-transform hover:-translate-y-1"
        >
          {creating ? 'Creating...' : 'Create Player'}
        </button>
      </form>
    );
  }

  // 🎮 If player is logged in
  return (
    <div className="space-y-8">
      {/* Create Game */}
      <div>
        <h2 className="text-xl font-semibold text-red-400 mb-3">
          Create New Game
        </h2>
        <form onSubmit={createGame}>
          <button
            type="submit"
            disabled={creating}
            className="w-full px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-transform hover:-translate-y-1"
          >
            {creating ? 'Creating Game...' : 'Create Game'}
          </button>
        </form>

        {password && (
          <div className="mt-4 p-4 bg-green-100/10 border border-green-400/40 rounded-md text-green-300">
            <p className="font-semibold">✅ Game created successfully!</p>
            <p>
              Password: <span className="font-mono text-green-200">{password}</span>
            </p>
            <button
              onClick={() => (window.location.href = `/game/${gameId}`)}
              className="mt-3 px-4 py-2 bg-green-500 rounded-lg text-white hover:bg-green-600 transition-all"
            >
              Go to Game
            </button>
          </div>
        )}
      </div>

      {/* Join Existing Game */}
      <div>
        <h2 className="text-xl font-semibold text-red-400 mb-3">
          Join Existing Game
        </h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!joinPassword.trim()) return;
            setJoining(true);
            setError('');
            try {
              const res = await fetch('/api/games/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  password: joinPassword.trim(),
                  playerId: currentPlayer._id,
                }),
              });
              if (res.ok) {
                const game = await res.json();
                window.location.href = `/game/${game._id}`;
              } else {
                const data = await res.json();
                setError(data.error || 'Failed to join game');
              }
            } catch (err) {
              setError('Network error');
            }
            setJoining(false);
          }}
          className="space-y-3"
        >
          <input
            type="text"
            placeholder="Enter game password"
            value={joinPassword}
            onChange={(e) => setJoinPassword(e.target.value)}
            className="w-full p-3 border border-white/20 rounded-md bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={joining}
            className="w-full px-5 py-2.5 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-transform hover:-translate-y-1"
          >
            {joining ? 'Joining...' : 'Join Game'}
          </button>
        </form>
      </div>
    </div>
  );
}
