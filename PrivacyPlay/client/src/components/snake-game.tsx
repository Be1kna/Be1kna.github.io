import { useEffect, useRef, useState, useCallback } from "react";

interface SnakeGameProps {
  onGameOver: () => void;
}

interface GameState {
  snake: { x: number; y: number }[];
  food: { x: number; y: number };
  dx: number;
  dy: number;
  score: number;
  running: boolean;
}

export default function SnakeGame({ onGameOver }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gameStateRef = useRef<GameState>({
    snake: [{ x: 200, y: 200 }],
    food: { x: 0, y: 0 },
    dx: 20,
    dy: 0,
    score: 0,
    running: false
  });

  const generateFood = useCallback(() => {
    gameStateRef.current.food = {
      x: Math.floor(Math.random() * 20) * 20,
      y: Math.floor(Math.random() * 20) * 20
    };
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = 'hsl(210, 40%, 99%)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const drawSnake = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = 'hsl(210, 100%, 45%)';
    gameStateRef.current.snake.forEach(segment => {
      ctx.fillRect(segment.x, segment.y, 18, 18);
    });
  }, []);

  const drawFood = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = 'hsl(0, 84%, 60%)';
    ctx.fillRect(gameStateRef.current.food.x, gameStateRef.current.food.y, 18, 18);
  }, []);

  const moveSnake = useCallback(() => {
    const head = {
      x: gameStateRef.current.snake[0].x + gameStateRef.current.dx,
      y: gameStateRef.current.snake[0].y + gameStateRef.current.dy
    };
    gameStateRef.current.snake.unshift(head);
  }, []);

  const checkCollision = useCallback(() => {
    const head = gameStateRef.current.snake[0];
    
    // Wall collision
    if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400) {
      return true;
    }
    
    // Self collision
    for (let i = 1; i < gameStateRef.current.snake.length; i++) {
      if (head.x === gameStateRef.current.snake[i].x && head.y === gameStateRef.current.snake[i].y) {
        return true;
      }
    }
    
    return false;
  }, []);

  const checkFoodCollision = useCallback(() => {
    const head = gameStateRef.current.snake[0];
    return head.x === gameStateRef.current.food.x && head.y === gameStateRef.current.food.y;
  }, []);

  const gameLoop = useCallback(() => {
    if (!gameStateRef.current.running) return;
    
    setTimeout(() => {
      clearCanvas();
      moveSnake();
      
      if (checkCollision()) {
        gameStateRef.current.running = false;
        setGameOver(true);
        setGameStarted(false);
        return;
      }
      
      if (checkFoodCollision()) {
        gameStateRef.current.score += 10;
        setScore(gameStateRef.current.score);
        generateFood();
      } else {
        gameStateRef.current.snake.pop();
      }
      
      drawFood();
      drawSnake();
      
      gameLoop();
    }, 150);
  }, [clearCanvas, moveSnake, checkCollision, checkFoodCollision, generateFood, drawFood, drawSnake]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!gameStateRef.current.running) return;
    
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    
    const keyPressed = e.keyCode;
    const goingUp = gameStateRef.current.dy === -20;
    const goingDown = gameStateRef.current.dy === 20;
    const goingRight = gameStateRef.current.dx === 20;
    const goingLeft = gameStateRef.current.dx === -20;
    
    if (keyPressed === LEFT_KEY && !goingRight) {
      gameStateRef.current.dx = -20;
      gameStateRef.current.dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
      gameStateRef.current.dx = 0;
      gameStateRef.current.dy = -20;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
      gameStateRef.current.dx = 20;
      gameStateRef.current.dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
      gameStateRef.current.dx = 0;
      gameStateRef.current.dy = 20;
    }
  }, []);

  const startGame = () => {
    // Initialize game state
    gameStateRef.current = {
      snake: [{ x: 200, y: 200 }],
      food: { x: 0, y: 0 },
      dx: 20,
      dy: 0,
      score: 0,
      running: true
    };
    
    setScore(0);
    setGameStarted(true);
    setGameOver(false);
    generateFood();
    gameLoop();
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Snake Game</h2>
        <p className="text-muted-foreground">Use arrow keys to move. Eat the red food to grow!</p>
        <div className="mt-4">
          <span className="text-sm font-medium">Score: </span>
          <span className="text-lg font-bold text-primary" data-testid="game-score">{score}</span>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <canvas
          ref={canvasRef}
          className="game-canvas"
          width="400"
          height="400"
          data-testid="game-canvas"
        />
      </div>

      <div className="text-center space-y-4">
        {!gameStarted && !gameOver && (
          <button
            onClick={startGame}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            data-testid="button-start-game"
          >
            Start Game
          </button>
        )}
        
        {gameOver && (
          <button
            onClick={onGameOver}
            className="w-full bg-accent text-accent-foreground py-3 px-6 rounded-lg font-medium hover:bg-accent/90 transition-colors"
            data-testid="button-continue-playing"
          >
            Continue Playing - Unlock Premium Features
          </button>
        )}
      </div>

      {gameOver && (
        <div className="mt-6 text-center">
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-bold mb-2">Game Over!</h3>
            <p className="text-muted-foreground text-sm">Want to continue with premium features?</p>
          </div>
        </div>
      )}
    </div>
  );
}
