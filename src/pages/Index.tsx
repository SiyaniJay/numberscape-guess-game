import { PlayerSetup } from "@/components/game/PlayerSetup";
import { GameInterface } from "@/components/game/GameInterface";
import { RoundEnd } from "@/components/game/RoundEnd";
import { useGameState } from "@/hooks/useGameState";

const Index = () => {
  const {
    gameState,
    startGame,
    makeGuess,
    useHint,
    startNewRound,
    resetGame
  } = useGameState();

  switch (gameState.phase) {
    case 'players':
      return <PlayerSetup onStart={startGame} />;
    
    case 'playing':
      return (
        <GameInterface
          gameState={gameState}
          onGuess={makeGuess}
          onHint={useHint}
        />
      );
    
    case 'round_end':
      return (
        <RoundEnd
          gameState={gameState}
          onNewRound={startNewRound}
          onNewGame={resetGame}
        />
      );
    
    default:
      return <PlayerSetup onStart={startGame} />;
  }
};

export default Index;
