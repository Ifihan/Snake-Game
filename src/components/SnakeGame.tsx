import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 120;

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const directionRef = useRef(direction);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameOver) resetGame();
        else setIsPaused(p => !p);
        return;
      }

      if (gameOver || isPaused) return;

      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
          if (y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check collision with food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        setDirection(directionRef.current);
        return newSnake;
      });
    };

    gameLoopRef.current = window.setInterval(moveSnake, GAME_SPEED);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [food, gameOver, isPaused, generateFood]);

  return (
    <div className="flex flex-col items-center font-[VT323]">
      <div className="flex justify-between items-center w-full max-w-[400px] mb-4 px-3 py-2 bg-black border-2 border-[#ff00ff]">
        <div className="text-[#00ffff] text-3xl font-bold">DATA.HARVESTED: {score}</div>
        <div className="text-[#ff00ff] text-xl animate-pulse">CMD: SPACE_TO_{gameOver ? 'REBOOT' : 'HALT'}</div>
      </div>
      
      <div 
        className="relative bg-[#050505] border-4 border-[#ff00ff] overflow-hidden"
        style={{ 
          width: 400, 
          height: 400,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          boxShadow: '-8px 8px 0px #00ffff'
        }}
      >
        {/* Render Food */}
        <div 
          className="bg-[#ff00ff]"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' // Diamond shape for glitchy feel
          }}
        />

        {/* Render Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div 
              key={`${segment.x}-${segment.y}-${index}`}
              className={`${isHead ? 'bg-white' : 'bg-[#00ffff]'}`}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
                border: '1px solid #050505'
              }}
            />
          );
        })}

        {/* Overlays */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10 tear-effect">
            <h2 className="text-6xl font-bold text-[#ff00ff] mb-4 glitch-text" data-text="SYSTEM.FAILURE">SYSTEM.FAILURE</h2>
            <p className="text-[#00ffff] text-3xl mb-8 bg-black px-4 py-2 border-2 border-[#00ffff]">FINAL_DATA: {score}</p>
            <button 
              onClick={resetGame}
              className="px-8 py-3 bg-transparent border-4 border-[#ff00ff] text-[#ff00ff] text-3xl font-bold hover:bg-[#00ffff] hover:text-black hover:border-[#00ffff] transition-colors"
              style={{ boxShadow: '6px 6px 0px #00ffff' }}
            >
              EXECUTE.REBOOT()
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
            <h2 className="text-6xl font-bold text-[#00ffff] tracking-widest glitch-text" data-text="HALTED">HALTED</h2>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-[#ff00ff] text-2xl text-center border-2 border-[#00ffff] p-4 bg-black" style={{ boxShadow: '4px 4px 0px #ff00ff' }}>
        INPUT: <span className="text-[#00ffff]">ARROW_KEYS</span><br/>
        TARGET: <span className="text-white">MAGENTA_ANOMALIES</span>
      </div>
    </div>
  );
}
