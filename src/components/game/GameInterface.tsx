import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Flame, Snowflake, Lightbulb, Target, Crown, Trophy } from "lucide-react";
import { GameState, GuessResult } from "@/types/game";
import { calculateHeatLevel, getHeatMessage, getRandomFeedback, generateHint, getEncouragingMessage } from "@/utils/gameLogic";
import { useToast } from "@/hooks/use-toast";

interface GameInterfaceProps {
  gameState: GameState;
  onGuess: (guess: number) => void;
  onHint: () => void;
  onGameEnd: () => void;
}

export function GameInterface({ gameState, onGuess, onHint, onGameEnd }: GameInterfaceProps) {
  const [currentGuess, setCurrentGuess] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [lastHint, setLastHint] = useState("");
  const { toast } = useToast();

  if (!gameState.difficulty) return null;

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const [min, max] = gameState.difficulty.range;
  const isGameOver = gameState.phase === 'finished';
  const lastGuess = gameState.gameHistory[gameState.gameHistory.length - 1];

  const handleGuess = () => {
    const guess = parseInt(currentGuess);
    if (isNaN(guess) || guess < min || guess > max) {
      toast({
        title: "Invalid guess",
        description: `Please enter a number between ${min} and ${max}`,
        variant: "destructive"
      });
      return;
    }
    onGuess(guess);
    setCurrentGuess("");
  };

  const handleHint = () => {
    const hint = generateHint(gameState.targetNumber, gameState.difficulty.range);
    setLastHint(hint);
    setShowHint(true);
    onHint();
    
    toast({
      title: "💡 Hint revealed!",
      description: hint,
    });
  };

  const getHeatIcon = (heatLevel: GuessResult['heatLevel']) => {
    switch (heatLevel) {
      case 'blazing':
      case 'hot':
        return <Flame className="w-5 h-5 text-red-500" />;
      case 'warm':
        return <Target className="w-5 h-5 text-yellow-500" />;
      case 'cool':
        return <Snowflake className="w-5 h-5 text-blue-400" />;
      case 'ice_cold':
        return <Snowflake className="w-5 h-5 text-blue-200" />;
    }
  };

  if (isGameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-primary/20 animate-slide-up">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {gameState.winner ? (
                <Crown className="w-16 h-16 text-yellow-500 animate-pulse" />
              ) : (
                <Trophy className="w-16 h-16 text-primary animate-pulse" />
              )}
            </div>
            <CardTitle className="text-3xl bg-gradient-gaming bg-clip-text text-transparent">
              {gameState.winner ? `🎉 ${gameState.winner} Wins!` : 'Game Over!'}
            </CardTitle>
            <CardDescription className="text-lg">
              The number was <span className="text-primary font-bold">{gameState.targetNumber}</span>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-center">Final Leaderboard</h3>
              {gameState.players
                .sort((a, b) => a.attempts - b.attempts)
                .map((player, index) => (
                  <div key={player.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <Badge variant={index === 0 ? "default" : "outline"}>
                        #{index + 1}
                      </Badge>
                      <span className="font-medium">
                        {player.name}
                        {player.name === gameState.winner && " 👑"}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {player.attempts} attempts, {player.hintsUsed} hints
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

            <Button variant="gaming" size="lg" className="w-full" onClick={onGameEnd}>
              Play Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Game Header */}
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl bg-gradient-gaming bg-clip-text text-transparent">
                  NUMBERSCAPE
                </CardTitle>
                <CardDescription>
                  {gameState.difficulty.tag} • Range: {min}-{max}
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-primary text-primary">
                Target: ???
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Current Player */}
        <Card className="border-accent/20 animate-slide-up">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Target className="w-6 h-6 text-accent" />
              {currentPlayer.name}'s Turn
            </CardTitle>
            <CardDescription>
              {getEncouragingMessage()}
            </CardDescription>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Attempts Left</span>
                  <span>{gameState.difficulty.maxAttempts - currentPlayer.attempts}</span>
                </div>
                <Progress 
                  value={((gameState.difficulty.maxAttempts - currentPlayer.attempts) / gameState.difficulty.maxAttempts) * 100}
                  className="h-2"
                />
              </div>
              <Badge variant={currentPlayer.hintsUsed === 0 ? "default" : "outline"}>
                {currentPlayer.hintsUsed === 0 ? "Free Hint!" : `${currentPlayer.hintsUsed} hints used`}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="number"
                value={currentGuess}
                onChange={(e) => setCurrentGuess(e.target.value)}
                placeholder={`Enter ${min}-${max}`}
                min={min}
                max={max}
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
              />
              <Button variant="gaming" onClick={handleGuess} disabled={!currentGuess}>
                Guess!
              </Button>
              <Button
                variant="outline"
                onClick={handleHint}
                className="border-warning text-warning hover:bg-warning hover:text-warning-foreground"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Hint
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Last Guess Feedback */}
        {lastGuess && (
          <Card className="border-accent/20 animate-heat-pulse">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getHeatIcon(lastGuess.heatLevel)}
                  <div>
                    <p className="font-medium">{lastGuess.player} guessed {lastGuess.guess}</p>
                    <p className="text-sm text-muted-foreground">
                      {getHeatMessage(lastGuess.heatLevel)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {lastGuess.result === 'too_low' && getRandomFeedback('too_low')}
                    {lastGuess.result === 'too_high' && getRandomFeedback('too_high')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {lastGuess.attemptsLeft} attempts left
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hint Display */}
        {showHint && lastHint && (
          <Card className="border-warning/20 bg-warning/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-6 h-6 text-warning" />
                <p className="text-warning font-medium">{lastHint}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Players Status */}
        <Card className="border-muted/20">
          <CardHeader>
            <CardTitle className="text-lg">Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {gameState.players.map((player, index) => (
                <div
                  key={player.name}
                  className={`p-3 rounded-lg border ${
                    index === gameState.currentPlayerIndex
                      ? 'border-accent bg-accent/10'
                      : 'border-muted bg-muted/10'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{player.name}</span>
                    <div className="text-sm text-muted-foreground">
                      {player.attempts}/{gameState.difficulty.maxAttempts} • {player.hintsUsed}💡
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}