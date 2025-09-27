import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Flame, Snowflake, Lightbulb, Target } from "lucide-react";
import { GameState, GuessResult } from "@/types/game";
import { calculateHeatLevel, getHeatMessage, getRandomFeedback, generateHint, getEncouragingMessage } from "@/utils/gameLogic";
import { useToast } from "@/hooks/use-toast";
import iccLogo from "@/assets/icc-logo.png";

interface GameInterfaceProps {
  gameState: GameState;
  onGuess: (guess: number) => void;
  onHint: () => void;
}

export function GameInterface({ gameState, onGuess, onHint }: GameInterfaceProps) {
  const [currentGuess, setCurrentGuess] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [lastHint, setLastHint] = useState("");
  const { toast } = useToast();

  if (!gameState.difficulty) return null;

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const [min, max] = gameState.difficulty.range;
  const isGameOver = gameState.phase === 'finished';
  const lastGuess = gameState.gameHistory[gameState.gameHistory.length - 1];
  const currentPlayerCanGuess = currentPlayer.attempts < gameState.difficulty.maxAttempts;

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

  if (isGameOver) return null;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Game Header */}
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={iccLogo} alt="ICC Logo" className="h-10 w-auto" />
                <div>
                  <CardTitle className="text-2xl bg-gradient-gaming bg-clip-text text-transparent">
                    ICC Number Challenge
                  </CardTitle>
                  <CardDescription>
                    Round {gameState.roundNumber} • Range: {min}-{max}
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="border-primary text-primary">
                Target: ???
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Scoreboard */}
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg text-center">Scoreboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(gameState.scores).map(([playerName, score]) => (
                <div key={playerName} className="text-center p-3 rounded-lg bg-secondary/50">
                  <div className="font-medium">{playerName}</div>
                  <div className="text-2xl font-bold text-primary">{score}</div>
                </div>
              ))}
            </div>
          </CardContent>
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
                  <span>{Math.max(0, gameState.difficulty.maxAttempts - currentPlayer.attempts)}</span>
                </div>
                <Progress 
                  value={((Math.max(0, gameState.difficulty.maxAttempts - currentPlayer.attempts)) / gameState.difficulty.maxAttempts) * 100}
                  className="h-2"
                />
              </div>
              <Badge variant={currentPlayer.hintsUsed === 0 ? "default" : "outline"}>
                {currentPlayer.hintsUsed === 0 ? "Free Hint!" : `${currentPlayer.hintsUsed} hints used`}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {!currentPlayerCanGuess && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
                <p className="text-destructive font-medium">{currentPlayer.name} is out of attempts!</p>
              </div>
            )}
            <div className="flex gap-2">
              <Input
                type="number"
                value={currentGuess}
                onChange={(e) => setCurrentGuess(e.target.value)}
                placeholder={currentPlayerCanGuess ? `Enter ${min}-${max}` : "No attempts left"}
                min={min}
                max={max}
                className="flex-1"
                disabled={!currentPlayerCanGuess}
                onKeyDown={(e) => e.key === 'Enter' && currentPlayerCanGuess && handleGuess()}
              />
              <Button 
                variant="gaming" 
                onClick={handleGuess} 
                disabled={!currentGuess || !currentPlayerCanGuess}
              >
                Guess!
              </Button>
              <Button
                variant="outline"
                onClick={handleHint}
                disabled={!currentPlayerCanGuess}
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