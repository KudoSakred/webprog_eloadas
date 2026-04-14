import React, { useState } from 'react';

export default function GameRoom() {
  const [score, setScore] = useState(0);
  return (
    <div style={{ textAlign: 'center', backgroundColor: '#282c34', color: 'white', padding: '20px' }}>
      <h2>Space Clicker Game</h2>
      <p>Score: {score}</p>
      <button onClick={() => setScore(score + 1)}>Shoot Asteroid</button>
    </div>
  );
}