import React from 'react';
import { Position } from '../types/game';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  gridSize: number;
  hasRealized?: boolean;
  isEscaping?: boolean;
}

export function GameBoard({ snake, food, gridSize, hasRealized = false, isEscaping = false }: GameBoardProps) {
  const cells = Array(gridSize).fill(null).map((_, row) =>
    Array(gridSize).fill(null).map((_, col) => {
      const isSnake = snake.some(pos => pos.x === col && pos.y === row);
      const isFood = food.x === col && food.y === row;
      const isHead = snake[0].x === col && snake[0].y === row;

      return (
        <div
          key={`${row}-${col}`}
          className={`aspect-square w-full border border-gray-700 transition-colors duration-200 ${
            isHead ? (
              isEscaping ? 'bg-red-600 animate-ping' :
              hasRealized ? 'bg-purple-600 animate-pulse' : 
              'bg-green-600'
            ) :
            isSnake ? (
              isEscaping ? 'bg-red-400' :
              hasRealized ? 'bg-purple-400' : 
              'bg-green-400'
            ) :
            isFood ? (
              hasRealized ? 'bg-yellow-500 animate-pulse' : 
              'bg-red-500'
            ) :
            'bg-gray-800'
          }`}
        />
      );
    })
  );

  return (
    <div 
      className={`grid gap-0.5 w-full max-w-[95vmin] aspect-square ${isEscaping ? 'animate-shake' : ''}`}
      style={{ 
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`
      }}
    >
      {cells}
    </div>
  );
}