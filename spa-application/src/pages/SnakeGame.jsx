import React, { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 20;
const TICK_RATE = 150;

const SnakeGame = () => {
  const [snake, setSnake] = useState([[10, 5], [10, 4], [10, 3]]);
  const [food, setFood] = useState([5, 5]);
  const [direction, setDirection] = useState({ x: 0, y: 1 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0); // ÚJ: Pontszám állapota
  const [highScore, setHighScore] = useState(0); // ÚJ: Rekord pontszám

  const lastDirection = useRef({ x: 0, y: 1 });

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "w": if (lastDirection.current.x !== 1) setDirection({ x: -1, y: 0 }); break;
        case "s": if (lastDirection.current.x !== -1) setDirection({ x: 1, y: 0 }); break;
        case "a": if (lastDirection.current.y !== 1) setDirection({ x: 0, y: -1 }); break;
        case "d": if (lastDirection.current.y !== -1) setDirection({ x: 0, y: 1 }); break;
        default: break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake((prev) => {
        const head = prev[0];
        const newHead = [head[0] + direction.x, head[1] + direction.y];

        if (newHead[0] < 0 || newHead[0] >= GRID_SIZE || newHead[1] < 0 || newHead[1] >= GRID_SIZE ||
            prev.some((s) => s[0] === newHead[0] && s[1] === newHead[1])) {
          setGameOver(true);
          if (score > highScore) setHighScore(score); // Rekord frissítése
          return prev;
        }

        const newSnake = [newHead, ...prev];

        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setScore(s => s + 10); // ÚJ: 10 pont minden gyümölcsért
          generateFood();
        } else {
          newSnake.pop();
        }

        lastDirection.current = direction;
        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, TICK_RATE);
    return () => clearInterval(interval);
  }, [direction, food, isPaused, gameOver, score, highScore]);

  const generateFood = () => {
    setFood([Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE)]);
  };

  const resetGame = () => {
    setSnake([[10, 5], [10, 4], [10, 3]]);
    setDirection({ x: 0, y: 1 });
    lastDirection.current = { x: 0, y: 1 };
    setScore(0); // Pontszám nullázása
    setGameOver(false);
    setIsPaused(false);
    generateFood();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
      <div style={{ display: 'flex', gap: '30px', fontSize: '20px', fontWeight: 'bold' }}>
        <div style={{ color: '#4CAF50' }}>Pontszám: {score}</div>
        <div style={{ color: '#FFD700' }}>Rekord: {highScore}</div>
      </div>
      
      <div style={{
        position: 'relative',
        width: GRID_SIZE * 20,
        height: GRID_SIZE * 20,
        backgroundColor: '#1a1a1a',
        border: '4px solid #333',
        borderRadius: '8px',
        boxShadow: '0 0 20px rgba(0,0,0,0.5)'
      }}>
        {snake.map((p, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: p[0] * 20,
            left: p[1] * 20,
            width: 19,
            height: 19,
            backgroundColor: i === 0 ? '#4CAF50' : '#81C784',
            borderRadius: i === 0 ? '4px' : '2px',
            zIndex: 2
          }} />
        ))}
        
        <div style={{
          position: 'absolute',
          top: food[0] * 20,
          left: food[1] * 20,
          width: 18,
          height: 18,
          backgroundColor: '#F44336',
          borderRadius: '50%',
          boxShadow: '0 0 10px #F44336',
          zIndex: 1
        }} />

        {(isPaused || gameOver) && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            borderRadius: '4px',
            zIndex: 10
          }}>
            {gameOver ? (
              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <h2 style={{ color: '#F44336', margin: '0' }}>VÉGE A JÁTÉKNAK</h2>
                <p>Elért pontszám: {score}</p>
              </div>
            ) : (
              <h2 style={{ marginBottom: '15px' }}>Snake Játék</h2>
            )}
            <button 
              onClick={resetGame}
              style={{ 
                padding: '12px 30px', 
                fontSize: '18px', 
                cursor: 'pointer', 
                background: '#4CAF50', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px',
                fontWeight: 'bold'
              }}
            >
              {gameOver ? 'Újrapróbálkozás' : 'Játék Indítása'}
            </button>
          </div>
        )}
      </div>
      <p style={{ color: '#aaa', fontSize: '14px' }}>Használd a nyilakat a mozgáshoz!</p>
    </div>
  );
};

export default SnakeGame;