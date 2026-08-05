import React, { useState, useEffect, useRef } from 'react';

const GRID = 20;

const randomFood = (snake) => {
  const taken = new Set(snake.map(s => `${s.x},${s.y}`));
  const free = [];
  for (let x = 0; x < GRID; x++) {
    for (let y = 0; y < GRID; y++) {
      if (!taken.has(`${x},${y}`)) free.push({ x, y });
    }
  }
  return free[Math.floor(Math.random() * free.length)] || { x: 0, y: 0 };
};

export const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  // Direction applied on the last tick — guards against reversing into
  // yourself by pressing two keys within a single frame.
  const committedDir = useRef({ x: 1, y: 0 });

  const handleKeyDown = (e) => {
    const next = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
    }[e.key];
    if (!next) return;

    e.preventDefault();
    if (gameOver) return;
    if (isPaused) setIsPaused(false);

    const current = committedDir.current;
    const isReversal = next.x === -current.x && next.y === -current.y;
    if (!isReversal) setDir(next);
  };

  useEffect(() => {
    if (gameOver || isPaused) return;
    const interval = setInterval(() => {
      committedDir.current = dir;
      setSnake(prev => {
        const head = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };
        const eating = head.x === food.x && head.y === food.y;
        // The tail vacates this tick unless we're eating, so it isn't a collision.
        const body = eating ? prev : prev.slice(0, -1);

        if (
          head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID ||
          body.some(seg => seg.x === head.x && seg.y === head.y)
        ) {
          setGameOver(true);
          setBest(b => Math.max(b, score));
          return prev;
        }

        const newSnake = [head, ...body];
        if (eating) {
          setScore(s => s + 10);
          setFood(randomFood(newSnake));
        }
        return newSnake;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [dir, food, gameOver, isPaused, score]);

  const reset = (e) => {
    e.stopPropagation();
    const start = [{ x: 10, y: 10 }];
    setSnake(start);
    setDir({ x: 1, y: 0 });
    committedDir.current = { x: 1, y: 0 };
    setGameOver(false);
    setScore(0);
    setFood(randomFood(start));
    setIsPaused(false);
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-full bg-[#1a1b26] outline-none"
      tabIndex="0"
      onKeyDown={handleKeyDown}
    >
       <div className="mb-4 text-green-400 font-mono flex gap-8 items-center">
         <span className="text-xl font-bold">Score: {score}</span>
         <span className="text-sm text-green-400/60">Best: {best}</span>
         <span className="text-sm opacity-50 hidden sm:block">Click here &amp; use Arrow Keys</span>
       </div>
       <div className="w-[400px] h-[400px] max-w-[90vw] max-h-[90vw] bg-black border-4 border-green-500/30 relative rounded shadow-[0_0_20px_rgba(34,197,94,0.1)] overflow-hidden">
         {snake.map((seg, i) => (
           <div
             key={i}
             className={`absolute rounded-sm ${i === 0 ? 'bg-green-300' : 'bg-green-500'}`}
             style={{ left: `${seg.x * 5}%`, top: `${seg.y * 5}%`, width: '5%', height: '5%' }}
           />
         ))}
         <div className="absolute bg-red-500 rounded-full animate-pulse" style={{ left: `${food.x * 5}%`, top: `${food.y * 5}%`, width: '5%', height: '5%' }} />

         {isPaused && !gameOver && (
           <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
             <span className="text-green-400 animate-pulse font-mono text-center px-4">Click to focus, then press any arrow key</span>
           </div>
         )}

         {gameOver && (
           <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm">
             <h2 className="text-3xl mb-2 text-red-500 font-bold tracking-widest">GAME OVER</h2>
             <p className="text-green-400/70 font-mono mb-4 text-sm">Score {score} · Best {best}</p>
             <button onClick={reset} className="px-6 py-2 border-2 border-green-500 text-green-500 font-bold hover:bg-green-500 hover:text-black transition-colors rounded">PLAY AGAIN</button>
           </div>
         )}
       </div>
    </div>
  );
};
