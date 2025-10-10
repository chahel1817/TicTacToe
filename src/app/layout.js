// app/layout.js
import './globals.css';

export const metadata = {
  title: 'Tic-Tac-Toe Game',
  description: 'A full-featured Tic-Tac-Toe game with multiplayer, leaderboard, and history',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
