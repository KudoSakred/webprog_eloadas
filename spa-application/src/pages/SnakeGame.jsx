import React, { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 20;

// Nehézségi szintekhez tartozó sebességek (ms)
const SPEEDS = {
  Könnyű: 200,
  Közepes: 120,
  Nehéz: 70
};

const SnakeGame = () => {
  const [snake, setSnake] = useState([[10, 5], [10, 4], [10, 3]]);
  const [food, setFood] = useState([5, 5]);
  const [direction, setDirection] = useState({ x: 0, y: 1 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  // ÚJ: Nehézségi fok állapota
  const [difficulty, setDifficulty] = useState('Közepes');

  const lastDirection = useRef({ x: 0, y: 1 });

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key.toLowerCase()) {
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

        // Ütközés ellenőrzése
        if (newHead[0] < 0 || newHead[0] >= GRID_SIZE || newHead[1] < 0 || newHead[1] >= GRID_SIZE ||
            prev.some((s) => s[0] === newHead[0] && s[1] === newHead[1])) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Étel megevése
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setScore(s => s + 10);
          generateFood();
        } else {
          newSnake.pop();
        }

        lastDirection.current = direction;
        return newSnake;
      });
    };

    // A TICK_RATE most már a kiválasztott nehézségtől függ
    const interval = setInterval(moveSnake, SPEEDS[difficulty]);
    return () => clearInterval(interval);
  }, [direction, food, isPaused, gameOver, difficulty]);

  // Rekord frissítése, ha vége a játéknak
  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
    }
  }, [gameOver, score, highScore]);

  const generateFood = () => {
    setFood([Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE)]);
  };

  const resetGame = () => {
    setSnake([[10, 5], [10, 4], [10, 3]]);
    setDirection({ x: 0, y: 1 });
    lastDirection.current = { x: 0, y: 1 };
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    generateFood();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', fontFamily: 'Arial, sans-serif' }}>
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
          zIndex: 1
        }} />

        {(isPaused || gameOver) && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            zIndex: 10,
            textAlign: 'center'
          }}>
            {gameOver ? (
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ color: '#F44336' }}>VÉGE A JÁTÉKNAK</h2>
                <p>Elért pontszám: {score}</p>
              </div>
            ) : (
              <h2 style={{ marginBottom: '20px' }}>Kígyós Játék</h2>
            )}

            {/* NEHÉZSÉG VÁLASZTÓ */}
            {!gameOver && isPaused && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ marginBottom: '10px' }}>Válassz nehézséget:</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {Object.keys(SPEEDS).map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      style={{
                        padding: '8px 15px',
                        cursor: 'pointer',
                        background: difficulty === level ? '#4CAF50' : '#444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        transition: '0.3s'
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
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
      <p style={{ color: '#534e4e', fontSize: '14px' }}>
        Nehézség: <strong>{difficulty}</strong> | Irányítás: W, A, S, D
      </p>
    </div>
  );
};

export default SnakeGame;