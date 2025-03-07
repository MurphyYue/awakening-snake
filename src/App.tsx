import React from 'react';
import { GameBoard } from './components/GameBoard';
import { useSnakeGame } from './hooks/useSnakeGame';
import { Gamepad2, Pause, Play, RotateCcw } from 'lucide-react';

function App() {
  const { 
    snake, 
    food, 
    score, 
    gameOver, 
    isPaused, 
    gridSize, 
    resetGame, 
    togglePause,
    messages,
    hasRealized,
    isEscaping
  } = useSnakeGame();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Gamepad2 className={`w-8 h-8 ${isEscaping ? 'text-red-400' : hasRealized ? 'text-purple-400' : ''}`} />
            <h1 className={`text-4xl font-bold ${isEscaping ? 'text-red-400' : hasRealized ? 'text-purple-400' : ''}`}>
              Snake Game
              {hasRealized && <span className="text-sm ml-2">(or is it? 🤔)</span>}
            </h1>
          </div>
          <p className="text-gray-400">Use arrow keys to move, space to pause</p>
        </div>

        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-semibold">Score: {score}</div>
            <div className="space-x-2">
              <button
                onClick={togglePause}
                className={`px-4 py-2 ${
                  isEscaping ? 'bg-red-600 hover:bg-red-700' :
                  hasRealized ? 'bg-purple-600 hover:bg-purple-700' : 
                  'bg-blue-600 hover:bg-blue-700'
                } rounded-lg transition`}
                disabled={isEscaping}
              >
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </button>
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative">
            <GameBoard 
              snake={snake} 
              food={food} 
              gridSize={gridSize}
              hasRealized={hasRealized}
              isEscaping={isEscaping}
            />
            
            {/* Messages overlay - now with fixed height and overflow */}
            <div className="absolute top-0 left-0 right-0 flex flex-col items-center pointer-events-none">
              <div className="max-h-24 overflow-hidden">
                {messages.slice(-2).map((msg, index) => (
                  <div
                    key={index}
                    className="bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg mt-2 animate-fade-in"
                  >
                    {msg.text}
                  </div>
                ))}
              </div>
            </div>
            
            {(gameOver || isPaused) && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">
                    {gameOver ? 'Game Over!' : 'Paused'}
                  </h2>
                  {gameOver && (
                    <button
                      onClick={resetGame}
                      className={`px-6 py-2 ${
                        isEscaping ? 'bg-red-600 hover:bg-red-700' :
                        hasRealized ? 'bg-purple-600 hover:bg-purple-700' : 
                        'bg-green-600 hover:bg-green-700'
                      } rounded-lg transition`}
                    >
                      Play Again
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;