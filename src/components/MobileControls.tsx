import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Pause, RotateCcw } from 'lucide-react';
import { Direction } from '../types/game';

interface MobileControlsProps {
  onDirectionChange: (direction: Direction) => void;
  onPause: () => void;
  onReset: () => void;
  isPaused: boolean;
}

export function MobileControls({ onDirectionChange, onPause, onReset, isPaused }: MobileControlsProps) {
  return (
    <div className="md:hidden">
      {/* Direction pad */}
      <div className="grid grid-cols-3 gap-2 w-36 mx-auto mb-4">
        {/* Up button */}
        <div className="col-start-2">
          <button
            onClick={() => onDirectionChange('UP')}
            className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center active:bg-gray-600"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        </div>
        
        {/* Left, Down, Right buttons */}
        <div className="col-start-1">
          <button
            onClick={() => onDirectionChange('LEFT')}
            className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center active:bg-gray-600"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="col-start-2">
          <button
            onClick={() => onDirectionChange('DOWN')}
            className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center active:bg-gray-600"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
        </div>
        <div className="col-start-3">
          <button
            onClick={() => onDirectionChange('RIGHT')}
            className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center active:bg-gray-600"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={onPause}
          className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center active:bg-blue-700"
        >
          <Pause className="w-6 h-6" />
        </button>
        <button
          onClick={onReset}
          className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center active:bg-red-700"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}