// lib/utils.js
export const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6]          // diags
];

export function checkWinner(board) {
  for (const line of WIN_LINES) {
    const [a,b,c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winnerMark: board[a], line };
    }
  }
  if (board.every(cell => cell !== null)) {
    return { winnerMark: null, draw: true };
  }
  return null;
}

export function nextTurn(current) {
  return current === 'X' ? 'O' : 'X';
}
