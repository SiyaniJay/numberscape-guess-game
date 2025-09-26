import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Trophy, RotateCcw, RefreshCw } from "lucide-react";
import { GameState } from "@/types/game";
import iccLogo from "@/assets/icc-logo.png";

interface RoundEndProps {
  gameState: GameState;
  onNewRound: () => void;
  onNewGame: () => void;
}

export function RoundEnd({ gameState, onNewRound, onNewGame }: RoundEndProps) {
  const sortedPlayers = Object.entries(gameState.scores).sort(([,a], [,b]) => b - a);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-primary/20 animate-slide-up">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src={iccLogo} alt="ICC Logo" className="h-12 w-auto" />
          </div>
          
          <div className="flex justify-center mb-4">
            {gameState.winner ? (
              <Crown className="w-16 h-16 text-yellow-500 animate-pulse" />
            ) : (
              <Trophy className="w-16 h-16 text-primary animate-pulse" />
            )}
          </div>
          
          <CardTitle className="text-3xl bg-gradient-gaming bg-clip-text text-transparent">
            {gameState.winner ? `🎉 ${gameState.winner} Wins Round ${gameState.roundNumber}!` : `Round ${gameState.roundNumber} Complete!`}
          </CardTitle>
          <CardDescription className="text-lg">
            The number was <span className="text-primary font-bold">{gameState.targetNumber}</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-center">Scoreboard</h3>
            {sortedPlayers.map(([playerName, score], index) => (
              <div key={playerName} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <Badge variant={index === 0 ? "default" : "outline"}>
                    #{index + 1}
                  </Badge>
                  <span className="font-medium text-lg">
                    {playerName}
                    {playerName === gameState.winner && " 👑"}
                  </span>
                </div>
                <div className="text-xl font-bold text-primary">
                  {score} {score === 1 ? 'point' : 'points'}
                </div>
              </div>
            ))}
          </div>

          {!gameState.winner && gameState.closestGuess.player && (
            <div className="text-center p-4 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-accent">
                Closest guess: <strong>{gameState.closestGuess.player}</strong> with{" "}
                <strong>{gameState.closestGuess.guess}</strong> (off by {gameState.closestGuess.difference})
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
            <Button variant="outline" size="lg" className="flex-1" onClick={onNewRound}>
              <RotateCcw className="w-4 h-4 mr-2" />
              New Round
            </Button>
            <Button variant="gaming" size="lg" className="flex-1" onClick={onNewGame}>
              <RefreshCw className="w-4 h-4 mr-2" />
              New Game
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            New Round: Keep scores & play another round<br />
            New Game: Reset scores & start fresh
          </p>
        </CardContent>
      </Card>
    </div>
  );
}