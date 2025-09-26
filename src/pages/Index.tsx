import { DifficultySelector } from "@/components/game/DifficultySelector";
import { PlayerSetup } from "@/components/game/PlayerSetup";
import { GameInterface } from "@/components/game/GameInterface";
import { useGameState } from "@/hooks/useGameState";

const Index = () => {
  const {
    gameState,
    setDifficulty,
    startGame,
    makeGuess,
    useHint,
    resetGame,
    goBackToDifficulty
  } = useGameState();

  switch (gameState.phase) {
    case 'difficulty':
      return <DifficultySelector onSelect={setDifficulty} />;
    
    case 'players':
      return (
        <PlayerSetup
          difficulty={gameState.difficulty!}
          onStart={startGame}
          onBack={goBackToDifficulty}
        />
      );
    
    case 'playing':
    case 'finished':
      return (
        <GameInterface
          gameState={gameState}
          onGuess={makeGuess}
          onHint={useHint}
          onGameEnd={resetGame}
        />
      );
    
    default:
      return <DifficultySelector onSelect={setDifficulty} />;
  }
};

export default Index;
