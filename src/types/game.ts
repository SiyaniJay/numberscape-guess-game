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
  phase: 'players' | 'playing' | 'finished' | 'round_end';
  difficulty: GameDifficulty | null;
  players: Player[];
  currentPlayerIndex: number;
  targetNumber: number;
  winner: string | null;
  scores: Record<string, number>;
  roundNumber: number;
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

export const ICC_DIFFICULTY: GameDifficulty = {
  name: 'icc_classic',
  range: [1, 100],
  maxAttempts: 10,
  tag: 'ICC Classic 🏏',
  description: 'Official ICC format: 1-100, 10 attempts'
};