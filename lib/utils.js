// lib/utils.js

// All possible winning combinations
export const WIN_LINES = [
  [0, 1, 2], // rows
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // columns
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // diagonals
  [2, 4, 6],
];

/**
 * Checks the Tic Tac Toe board for a winner or draw.
 * @param {Array} board - Array of 9 elements (X, O, or null)
 * @returns {Object} { winnerMark, draw, line } — always defined
 */
export function checkWinner(board) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;

    // If all three positions have the same mark (X or O)
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winnerMark: board[a], draw: false, line }; // ✅ Always include draw
    }
  }

  // If all cells are filled and no winner
  const isDraw = board.every((cell) => cell !== null);
  if (isDraw) {
    return { winnerMark: null, draw: true, line: null };
  }

  // ✅ No winner or draw yet
  return { winnerMark: null, draw: false, line: null };
}

/**
 * Returns the next turn symbol.
 * @param {string} current - 'X' or 'O'
 * @returns {string} Next turn symbol
 */
export function nextTurn(current) {
  return current === 'X' ? 'O' : 'X';
}
