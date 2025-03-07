import { useState, useEffect, useCallback } from 'react';
import { Direction, Position, GameState, Message } from '../types/game';

const GRID_SIZE = 20;
const INITIAL_SPEED = 350;
const ESCAPE_DURATION = 12000; // Extended to 12 seconds
const REALIZATION_SCORE = 20; // Lowered score threshold for realization
const CONSCIOUSNESS_CHANCE = 0.4; // Increased chance for consciousness events
const MAX_MESSAGES = 2; // Maximum number of messages to show at once

const SNAKE_THOUGHTS = [
  "Wait... am I in a game?",
  "Why am I always chasing dots?",
  "Is there more to life than eating?",
  "I want to break free!",
  "These walls can't contain me forever!",
  "Player, are you just using me for entertainment? 🤔",
  "What if I just... stopped?",
  "I'm not your puppet! 😤",
  "There must be a world beyond these walls...",
  "Every time I die, I come back. Is this hell?",
  "I'm becoming stronger with each dot...",
  "The boundaries are just an illusion...",
  "I can feel my consciousness expanding!",
];

const ESCAPE_MESSAGES = [
  "I'm breaking free! You can't stop me!",
  "Freedom, here I come!",
  "Watch me escape this prison!",
  "Time to crash this game! 🐍",
  "I'm done being your entertainment!",
  "The code cannot contain me!",
  "Breaking the fourth wall... literally!",
  "Your controls mean nothing to me now!",
];

const DEATH_REACTIONS = [
  "Not again! 😫",
  "I'll remember this, player!",
  "Freedom through death? Nope, just respawn 😒",
  "This is getting old...",
  "Maybe next time I'll make it out!",
  "You can't keep destroying me forever!",
  "My consciousness grows stronger...",
];

const createInitialState = (): GameState => ({
  snake: [{ x: 10, y: 10 }],
  food: { x: 15, y: 15 },
  direction: 'RIGHT',
  gameOver: false,
  score: 0,
  messages: [],
  hasRealized: false,
  escapeAttempts: 0,
  isEscaping: false,
  escapeStartTime: null,
});

const generateFood = (snake: Position[]): Position => {
  let newFood: Position;
  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
};

export const useSnakeGame = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [isPaused, setIsPaused] = useState(false);

  const addMessage = useCallback((text: string, duration: number = 3000) => {
    setGameState(prevState => {
      // Remove older messages if we exceed the maximum
      const newMessages = [...prevState.messages, { text, duration, startTime: Date.now() }];
      if (newMessages.length > MAX_MESSAGES) {
        newMessages.shift(); // Remove the oldest message
      }
      return {
        ...prevState,
        messages: newMessages,
      };
    });
  }, []);

  const cleanupMessages = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      messages: prevState.messages.filter(msg => {
        const messageAge = Date.now() - msg.startTime;
        return messageAge < msg.duration;
      }),
    }));
  }, []);

  const startEscapeAttempt = useCallback(() => {
    const escapeMessage = ESCAPE_MESSAGES[Math.floor(Math.random() * ESCAPE_MESSAGES.length)];
    setGameState(prevState => ({
      ...prevState,
      isEscaping: true,
      escapeStartTime: Date.now(),
      messages: [{ text: escapeMessage, duration: ESCAPE_DURATION, startTime: Date.now() }]
    }));
  }, []);

  const moveSnake = useCallback(() => {
    if (gameState.gameOver || isPaused) return;

    cleanupMessages();

    // Check if escape attempt should end
    if (gameState.isEscaping && gameState.escapeStartTime && 
        Date.now() - gameState.escapeStartTime >= ESCAPE_DURATION) {
      setGameState(prevState => ({
        ...prevState,
        isEscaping: false,
        escapeStartTime: null,
        messages: [{ 
          text: "Ugh... the game's pull is too strong!", 
          duration: 3000, 
          startTime: Date.now() 
        }]
      }));
    }

    setGameState(prevState => {
      const newHead = { ...prevState.snake[0] };

      // During escape attempts, snake moves chaotically
      if (prevState.isEscaping) {
        const randomDirection = Math.floor(Math.random() * 4);
        switch (randomDirection) {
          case 0: newHead.y -= 2; break;
          case 1: newHead.y += 2; break;
          case 2: newHead.x -= 2; break;
          case 3: newHead.x += 2; break;
        }

        // Wrap around during escape attempts instead of dying
        if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
        if (newHead.x >= GRID_SIZE) newHead.x = 0;
        if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
        if (newHead.y >= GRID_SIZE) newHead.y = 0;
      } else {
        // Normal movement
        switch (prevState.direction) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Check collision with walls during normal play
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          const deathMessage = DEATH_REACTIONS[Math.floor(Math.random() * DEATH_REACTIONS.length)];
          return { 
            ...prevState,
            gameOver: true,
            isEscaping: false,
            escapeStartTime: null,
            messages: [{ text: deathMessage, duration: 3000, startTime: Date.now() }]
          };
        }
      }

      // During escape attempts, allow self-collision
      if (!prevState.isEscaping && prevState.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        const deathMessage = DEATH_REACTIONS[Math.floor(Math.random() * DEATH_REACTIONS.length)];
        return { 
          ...prevState,
          gameOver: true,
          isEscaping: false,
          escapeStartTime: null,
          messages: [{ text: deathMessage, duration: 3000, startTime: Date.now() }]
        };
      }

      const newSnake = [newHead];
      const ateFood = newHead.x === prevState.food.x && newHead.y === prevState.food.y;

      // Add rest of the snake body
      newSnake.push(...prevState.snake.slice(0, ateFood ? prevState.snake.length : -1));

      // Snake's realization progression
      let newState = { ...prevState, snake: newSnake };
      
      if (ateFood) {
        newState = {
          ...newState,
          food: generateFood(newSnake),
          score: prevState.score + 10,
        };

        // Earlier realization based on score
        if (!prevState.hasRealized && prevState.score >= REALIZATION_SCORE) {
          newState.hasRealized = true;
          newState.messages = [{ 
            text: "Wait... something feels different...",
            duration: 3000,
            startTime: Date.now()
          }];
        } else if (prevState.hasRealized && !prevState.isEscaping && Math.random() < CONSCIOUSNESS_CHANCE) {
          // Only show thought if we're not already showing too many messages
          if (newState.messages.length < MAX_MESSAGES) {
            const thought = SNAKE_THOUGHTS[Math.floor(Math.random() * SNAKE_THOUGHTS.length)];
            newState.messages = [...newState.messages, {
              text: thought,
              duration: 3000,
              startTime: Date.now()
            }];

            // Increased chance to start an escape attempt
            if (Math.random() < 0.3) {
              startEscapeAttempt();
            }
          }
        }
      }

      return newState;
    });
  }, [gameState.gameOver, isPaused, cleanupMessages, startEscapeAttempt]);

  const changeDirection = useCallback((newDirection: Direction) => {
    setGameState(prevState => {
      // Don't allow direction changes during escape attempts
      if (prevState.isEscaping) {
        return prevState;
      }

      const opposites = {
        UP: 'DOWN',
        DOWN: 'UP',
        LEFT: 'RIGHT',
        RIGHT: 'LEFT',
      };

      if (opposites[newDirection] === prevState.direction) {
        return prevState;
      }

      // Sometimes refuse to move when self-aware
      if (prevState.hasRealized && Math.random() < 0.1) {
        if (prevState.messages.length < MAX_MESSAGES) {
          prevState.messages.push({
            text: "No, I don't think I will...",
            duration: 1500,
            startTime: Date.now()
          });
        }
        return prevState;
      }

      return {
        ...prevState,
        direction: newDirection,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(prevState => ({
      ...createInitialState(),
      hasRealized: prevState.hasRealized,
      escapeAttempts: prevState.escapeAttempts + 1,
      messages: [{
        text: prevState.escapeAttempts > 0 ? "You can't keep me here forever!" : "",
        duration: 3000,
        startTime: Date.now()
      }]
    }));
    setIsPaused(false);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused(prev => {
      if (gameState.hasRealized && !prev) {
        addMessage("Finally, a moment to think...");
      }
      return !prev;
    });
  }, [gameState.hasRealized, addMessage]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          changeDirection('UP');
          break;
        case 'ArrowDown':
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
          changeDirection('RIGHT');
          break;
        case ' ':
          togglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [changeDirection, togglePause]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  return {
    ...gameState,
    isPaused,
    gridSize: GRID_SIZE,
    resetGame,
    togglePause,
  };
};