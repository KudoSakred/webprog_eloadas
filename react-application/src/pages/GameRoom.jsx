import React, { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };

export default function GameRoom() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const getRandomFood = useCallback(() => ({
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  }), []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'w': if (direction.y != 1) setDirection({ x: 0, y: -1 }); break;
        case 's': if (direction.y != -1) setDirection({ x: 0, y: 1 }); break;
        case 'a': if (direction.x != 1) setDirection({ x: -1, y: 0 }); break;
        case 'd': if (direction.x != -1) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;

    const moveSnake = setInterval(() => {
      setSnake((prev) => {
        const newHead = { x: prev[0].x + direction.x, y: prev[0].y + direction.y };

        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE ||
            prev.some(s => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(getRandomFood());
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 200);

    return () => clearInterval(moveSnake);
  }, [direction, food, gameOver, getRandomFood]);

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      justifyContent: 'center', minHeight: '100vh', backgroundColor: '#1a1a1a', color: 'white' 
    }}>
      <h1 style={{ marginBottom: '10px' }}>Snake Game</h1>
      <h3 style={{ marginBottom: '20px' }}>Score: {score}</h3>
      
      {gameOver && <h2 style={{ color: '#ff4444' }}>GAME OVER!</h2>}
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, 20px)`,
        border: '4px solid #2f5537',
        backgroundColor: '#345a30'
      }}>
        {[...Array(GRID_SIZE * GRID_SIZE)].map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some(s => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div key={i} style={{
              width: 20, height: 20,
              backgroundColor: isSnake ? '#4CAF50' : isFood ? '#FF5252' : 'transparent',
              borderRadius: isFood ? '50%' : '2px'
            }} />
          );
        })}
      </div>

      <h2 style={{ color: '#ffffff' }}>Controls: WASD</h2>

      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => window.location.reload()}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', borderRadius: '8px' }}
        >
          Restart
        </button>
        <a href="/" style={{ marginLeft: '20px', color: '#aaa', textDecoration: 'none' }}>Back to CRUD</a>
      </div>
    </div>
  );
}