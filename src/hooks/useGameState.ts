import { useState, useCallback } from 'react';
import { GameState, GameDifficulty, Player, GuessResult, ICC_DIFFICULTY } from '@/types/game';
import { calculateHeatLevel } from '@/utils/gameLogic';

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'players',
    difficulty: ICC_DIFFICULTY,
    players: [],
    currentPlayerIndex: 0,
    targetNumber: 0,
    winner: null,
    scores: {},
    roundNumber: 1,
    closestGuess: {
      player: null,
      guess: null,
      difference: Infinity
    },
    gameHistory: []
  });


  const startGame = useCallback((playerNames: string[]) => {
    const players: Player[] = playerNames.map(name => ({
      name,
      attempts: 0,
      hintsUsed: 0,
      isActive: true
    }));

    const scores = playerNames.reduce((acc, name) => ({ ...acc, [name]: 0 }), {});
    const [min, max] = ICC_DIFFICULTY.range;
    const targetNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    setGameState(prev => ({
      ...prev,
      phase: 'playing',
      players,
      targetNumber,
      currentPlayerIndex: 0,
      winner: null,
      scores,
      roundNumber: 1,
      closestGuess: {
        player: null,
        guess: null,
        difference: Infinity
      },
      gameHistory: []
    }));
  }, []);

  const makeGuess = useCallback((guess: number) => {
    if (!gameState.difficulty || gameState.phase !== 'playing') return;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const span = gameState.difficulty.range[1] - gameState.difficulty.range[0];
    const heatLevel = calculateHeatLevel(guess, gameState.targetNumber, span);
    const difference = Math.abs(guess - gameState.targetNumber);
    
    const result: GuessResult['result'] = 
      guess === gameState.targetNumber ? 'correct' :
      guess < gameState.targetNumber ? 'too_low' : 'too_high';

    // Update player attempts
    const updatedPlayers = [...gameState.players];
    updatedPlayers[gameState.currentPlayerIndex].attempts++;

    // Track closest guess
    let closestGuess = { ...gameState.closestGuess };
    if (difference < closestGuess.difference) {
      closestGuess = {
        player: currentPlayer.name,
        guess,
        difference
      };
    }

    // Create guess result
    const guessResult: GuessResult = {
      player: currentPlayer.name,
      guess,
      result,
      heatLevel,
      attemptsLeft: gameState.difficulty.maxAttempts - updatedPlayers[gameState.currentPlayerIndex].attempts
    };

    // Check for win condition
    if (result === 'correct') {
      const updatedScores = { ...gameState.scores };
      updatedScores[currentPlayer.name] = (updatedScores[currentPlayer.name] || 0) + 1;
      
      setGameState(prev => ({
        ...prev,
        phase: 'round_end',
        winner: currentPlayer.name,
        players: updatedPlayers,
        scores: updatedScores,
        gameHistory: [...prev.gameHistory, guessResult],
        closestGuess
      }));
      return;
    }

    // Check if all players are out of attempts
    const allPlayersExhausted = updatedPlayers.every(
      player => player.attempts >= gameState.difficulty!.maxAttempts
    );

    if (allPlayersExhausted) {
      setGameState(prev => ({
        ...prev,
        phase: 'round_end',
        players: updatedPlayers,
        gameHistory: [...prev.gameHistory, guessResult],
        closestGuess
      }));
      return;
    }

    // Find next active player
    let nextPlayerIndex = gameState.currentPlayerIndex;
    do {
      nextPlayerIndex = (nextPlayerIndex + 1) % gameState.players.length;
    } while (updatedPlayers[nextPlayerIndex].attempts >= gameState.difficulty.maxAttempts);

    setGameState(prev => ({
      ...prev,
      players: updatedPlayers,
      currentPlayerIndex: nextPlayerIndex,
      gameHistory: [...prev.gameHistory, guessResult],
      closestGuess
    }));
  }, [gameState]);

  const useHint = useCallback(() => {
    if (gameState.phase !== 'playing') return;

    const updatedPlayers = [...gameState.players];
    const currentPlayer = updatedPlayers[gameState.currentPlayerIndex];
    
    currentPlayer.hintsUsed++;
    
    // Extra hints cost an attempt
    if (currentPlayer.hintsUsed > 1) {
      currentPlayer.attempts++;
    }

    setGameState(prev => ({
      ...prev,
      players: updatedPlayers
    }));
  }, [gameState]);

  const startNewRound = useCallback(() => {
    const [min, max] = ICC_DIFFICULTY.range;
    const targetNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    
    const resetPlayers = gameState.players.map(player => ({
      ...player,
      attempts: 0,
      hintsUsed: 0
    }));

    setGameState(prev => ({
      ...prev,
      phase: 'playing',
      players: resetPlayers,
      targetNumber,
      currentPlayerIndex: 0,
      winner: null,
      roundNumber: prev.roundNumber + 1,
      closestGuess: {
        player: null,
        guess: null,
        difference: Infinity
      },
      gameHistory: []
    }));
  }, [gameState.players, gameState.roundNumber]);

  const resetGame = useCallback(() => {
    setGameState({
      phase: 'players',
      difficulty: ICC_DIFFICULTY,
      players: [],
      currentPlayerIndex: 0,
      targetNumber: 0,
      winner: null,
      scores: {},
      roundNumber: 1,
      closestGuess: {
        player: null,
        guess: null,
        difference: Infinity
      },
      gameHistory: []
    });
  }, []);

  return {
    gameState,
    startGame,
    makeGuess,
    useHint,
    startNewRound,
    resetGame
  };
}