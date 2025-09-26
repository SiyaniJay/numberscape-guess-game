export interface GameDifficulty {
  name: string;
  range: [number, number];
  maxAttempts: number;
  tag: string;
  description: string;
}

export interface Player {
  name: string;
  attempts: number;
  hintsUsed: number;
  isActive: boolean;
}

export interface GameState {
  phase: 'setup' | 'difficulty' | 'players' | 'playing' | 'finished';
  difficulty: GameDifficulty | null;
  players: Player[];
  currentPlayerIndex: number;
  targetNumber: number;
  winner: string | null;
  closestGuess: {
    player: string | null;
    guess: number | null;
    difference: number;
  };
  gameHistory: GuessResult[];
}

export interface GuessResult {
  player: string;
  guess: number;
  result: 'correct' | 'too_low' | 'too_high';
  heatLevel: 'ice_cold' | 'cool' | 'warm' | 'hot' | 'blazing';
  attemptsLeft: number;
}

export const DIFFICULTIES: Record<string, GameDifficulty> = {
  easy: {
    name: 'easy',
    range: [1, 50],
    maxAttempts: 12,
    tag: 'Breeze 🌬️',
    description: 'Perfect for beginners'
  },
  normal: {
    name: 'normal',
    range: [1, 100],
    maxAttempts: 10,
    tag: 'Classic 🎯',
    description: 'The standard experience'
  },
  hard: {
    name: 'hard',
    range: [1, 200],
    maxAttempts: 9,
    tag: 'Challenger 🧩',
    description: 'For experienced players'
  },
  chaos: {
    name: 'chaos',
    range: [1, 500],
    maxAttempts: 8,
    tag: 'Chaos 🌀',
    description: 'Ultimate challenge'
  }
};