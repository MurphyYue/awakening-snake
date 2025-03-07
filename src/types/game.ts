export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type Position = {
  x: number;
  y: number;
};

export type Message = {
  text: string;
  duration: number;
  startTime: number;
};

export type GameState = {
  snake: Position[];
  food: Position;
  direction: Direction;
  gameOver: boolean;
  score: number;
  messages: Message[];
  hasRealized: boolean;
  escapeAttempts: number;
  isEscaping: boolean;
  escapeStartTime: number | null;
};