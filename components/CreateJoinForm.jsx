'use client';

import { useState } from 'react';

export default function CreateJoinForm({ currentPlayer, setCurrentPlayer }) {
  const [name, setName] = useState('');
  const [gameId, setGameId] = useState('');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

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
        window.location.href = `/game/${game._id}`;
      } else {
        setError('Failed to create game');
      }
    } catch (err) {
      setError('Network error');
    }
    setCreating(false);
  };

  const joinGame = async (e) => {
    e.preventDefault();
    if (!currentPlayer || !gameId.trim()) return;
    setJoining(true);
    setError('');
    try {
      const res = await fetch(`/api/games/${gameId.trim()}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: currentPlayer._id }),
      });
      if (res.ok) {
        window.location.href = `/game/${gameId.trim()}`;
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to join game');
      }
    } catch (err) {
      setError('Network error');
    }
    setJoining(false);
  };

  if (!currentPlayer) {
    return (
      <form onSubmit={createPlayer} className="space-y-4">
        <h2 className="text-xl red-text mb-4">Create Player</h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary-red"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={creating} className="primary-button w-full">
          {creating ? 'Creating...' : 'Create Player'}
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl red-text mb-4">Create New Game</h2>
        <form onSubmit={createGame}>
          <button type="submit" disabled={creating} className="primary-button w-full">
            {creating ? 'Creating Game...' : 'Create Game'}
          </button>
        </form>
      </div>
      <div>
        <h2 className="text-xl red-text mb-4">Join Existing Game</h2>
        <form onSubmit={joinGame} className="space-y-2">
          <input
            type="text"
            placeholder="Enter game ID"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary-red"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={joining} className="secondary-button w-full">
            {joining ? 'Joining...' : 'Join Game'}
          </button>
        </form>
      </div>
    </div>
  );
}
