'use client';

import { useState, useEffect } from 'react';

export default function CreateJoinForm({ currentPlayer, setCurrentPlayer }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [gameId, setGameId] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
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
        {password && (
          <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-md">
            <p className="text-green-800 font-semibold">Game created successfully!</p>
            <p className="text-green-700">Password: <span className="font-mono">{password}</span></p>
            <button onClick={() => window.location.href = `/game/${gameId}`} className="mt-2 primary-button">
              Go to Game
            </button>
          </div>
        )}
      </div>
      <div>
        <h2 className="text-xl red-text mb-4">Join Existing Game</h2>
        <form onSubmit={async (e) => {
          e.preventDefault();
          if (!joinPassword.trim()) return;
          setJoining(true);
          setError('');
          try {
            const res = await fetch('/api/games/join', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password: joinPassword.trim(), playerId: currentPlayer._id }),
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
        }} className="space-y-2">
          <input
            type="text"
            placeholder="Enter game password"
            value={joinPassword}
            onChange={(e) => setJoinPassword(e.target.value)}
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
