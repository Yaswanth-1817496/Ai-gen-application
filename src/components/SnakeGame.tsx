import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Square, RotateCw } from 'lucide-react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const MIN_SPEED = 60;
const SPEED_INCREMENT = 2;

export const SnakeGame: React.FC<{ onScoreUpdate: (score: number) => void }> = ({ onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [nextDirection, setNextDirection] = useState<Point>({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [isPaused, setIsPaused] = useState(false);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 1, y: 0 });
    setNextDirection({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPaused(false);
    generateFood([{ x: 10, y: 10 }]);
    onScoreUpdate(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setNextDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setNextDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setNextDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setNextDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (!gameOver) setIsPaused(prev => !prev);
          else resetGame();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: (head.x + nextDirection.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + nextDirection.y + GRID_SIZE) % GRID_SIZE,
        };

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          if (score > highScore) setHighScore(score);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];
        setDirection(nextDirection);

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const nextScore = s + 10;
            onScoreUpdate(nextScore);
            return nextScore;
          });
          setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
          generateFood(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [gameOver, isPaused, nextDirection, food, speed, score, highScore, generateFood, onScoreUpdate]);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Slate Background (matches theme mainland)
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid Lines (Pattern design)
    ctx.strokeStyle = '#1e293b'; // slate-800
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0);
      ctx.lineTo(i * size, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * size);
      ctx.lineTo(canvas.width, i * size);
      ctx.stroke();
    }

    // Draw Food
    ctx.fillStyle = '#d946ef'; // fuchsia-500
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#d946ef';
    ctx.beginPath();
    ctx.arc(food.x * size + size / 2, food.y * size + size / 2, size / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      // Head is cyan-400, body fades to cyan-800
      const opacity = Math.max(0.2, 1 - index * 0.05);
      ctx.fillStyle = isHead ? '#22d3ee' : `rgba(34, 211, 238, ${opacity})`;
      
      if (isHead) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#22d3ee';
      }
      
      const padding = 1.5;
      ctx.fillRect(
        segment.x * size + padding,
        segment.y * size + padding,
        size - padding * 2,
        size - padding * 2
      );
      ctx.shadowBlur = 0;
    });

  }, [snake, food]);

  // Responsive Sizing
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      if (entries[0] && canvasRef.current) {
        const { width } = entries[0].contentRect;
        const squareSize = Math.min(width, 500); // Max size
        canvasRef.current.width = squareSize;
        canvasRef.current.height = squareSize;
      }
    });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto space-y-12 relative">
      <div className="relative w-full aspect-square max-w-[500px] bg-black border-4 border-neon-cyan/50 overflow-hidden shadow-[0_0_80px_rgba(0,255,255,0.2)] screen-tear">
        <div className="scanline" />
        <canvas ref={canvasRef} className="block grayscale contrast-150 brightness-125" style={{ imageRendering: 'pixelated' }} />
        
        <AnimatePresence>
          {(gameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center text-center p-8 z-20 overflow-hidden"
            >
              {/* Static Background Effect */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://media.giphy.com/media/oEI9uWU0m6VfQNoi1T/giphy.gif')] mix-blend-screen" />
              
              {gameOver ? (
                <>
                  <h2 className="text-7xl font-black text-neon-magenta mb-4 tracking-tighter glitch uppercase">SYSTEM_FAILURE</h2>
                  <p className="text-neon-cyan mb-12 font-mono text-xl uppercase tracking-[0.5em] animate-pulse">TERMINATED :: LINK_SEVERED</p>
                  
                  <div className="flex gap-16 mb-16 relative">
                    <div className="text-left border-l-4 border-neon-magenta pl-6">
                      <p className="text-sm text-neon-magenta/50 uppercase tracking-[0.3em] mb-2 font-mono">DATA_CONSUMED</p>
                      <p className="text-5xl font-black text-white tracking-widest">{score.toString().padStart(5, '0')}</p>
                    </div>
                    <div className="text-left border-l-4 border-neon-cyan pl-6">
                      <p className="text-sm text-neon-cyan/50 uppercase tracking-[0.3em] mb-2 font-mono">PEAK_BUFFER</p>
                      <p className="text-5xl font-black text-white tracking-widest">{highScore.toString().padStart(5, '0')}</p>
                    </div>
                  </div>

                  <button 
                    onClick={resetGame}
                    className="group relative bg-[#111] border-2 border-neon-cyan text-neon-cyan px-12 py-5 font-black uppercase tracking-[0.4em] transition-all hover:bg-neon-cyan hover:text-black active:scale-95 shadow-[0_0_30px_rgba(0,255,255,0.3)]"
                  >
                    <span className="relative z-10 flex items-center gap-4">
                      <RotateCw size={24} className="group-hover:rotate-180 transition-transform duration-700" />
                      RE_INITIALIZE
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-7xl font-black text-neon-cyan mb-12 tracking-tighter italic uppercase glitch">PROC_SUSPEND</h2>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="flex items-center gap-4 bg-neon-magenta text-black px-12 py-5 font-black uppercase tracking-[0.4em] hover:brightness-125 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,0,255,0.4)]"
                  >
                    <Play size={24} fill="currentColor" />
                    RESUME_SYNC
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Positional Data HUD Overlay */}
        {!gameOver && !isPaused && (
           <div className="absolute bottom-6 left-6 text-neon-cyan/40 text-sm font-mono uppercase tracking-[0.2em] pointer-events-none glitch">
             HUD::NODE[{snake[0].x.toString().padStart(2, '0')},{snake[0].y.toString().padStart(2, '0')}] | VEL::{((200-speed)/10).toFixed(2)}x
           </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-8 w-full max-w-[500px]">
        <div className="bg-black border-2 border-neon-cyan/30 p-6 shadow-[inset_0_0_20px_rgba(0,255,255,0.1)]">
            <span className="text-[11px] uppercase tracking-[0.5em] text-neon-cyan/50 mb-2 block font-bold">CYT_REMAINDER</span>
            <span className="text-5xl font-black text-white">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="bg-black border-2 border-neon-magenta/30 p-6 text-right shadow-[inset_0_0_20px_rgba(255,0,255,0.1)]">
            <span className="text-[11px] uppercase tracking-[0.5em] text-neon-magenta/50 mb-2 block font-bold">PEAK_SIG_STR</span>
            <span className="text-5xl font-black text-white">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>
      
      <p className="text-sm text-neon-cyan/40 font-mono tracking-widest uppercase animate-pulse">
        INPUT::COMMANDS :: ARROW_KEYS=NAV_SYNC • SPACE=BREAK_SEQ
      </p>
    </div>
  );
};
