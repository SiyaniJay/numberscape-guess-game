import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Users } from "lucide-react";
import { GameDifficulty } from "@/types/game";

interface PlayerSetupProps {
  difficulty: GameDifficulty;
  onStart: (playerNames: string[]) => void;
  onBack: () => void;
}

export function PlayerSetup({ difficulty, onStart, onBack }: PlayerSetupProps) {
  const [players, setPlayers] = useState<string[]>(["Player 1"]);
  const [newPlayerName, setNewPlayerName] = useState("");

  const addPlayer = () => {
    if (players.length < 7) {
      const name = newPlayerName.trim() || `Player ${players.length + 1}`;
      setPlayers([...players, name]);
      setNewPlayerName("");
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > 1) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const updatePlayer = (index: number, name: string) => {
    const updated = [...players];
    updated[index] = name || `Player ${index + 1}`;
    setPlayers(updated);
  };

  const handleStart = () => {
    onStart(players.map(name => name.trim() || "Anonymous"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-slide-up">
        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl bg-gradient-gaming bg-clip-text text-transparent">
              Setup Players
            </CardTitle>
            <CardDescription className="text-lg">
              Playing on {difficulty.tag} difficulty ({difficulty.range[0]}-{difficulty.range[1]})
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex items-center gap-2 justify-center">
              <Users className="w-5 h-5 text-primary" />
              <Badge variant="outline" className="border-primary text-primary">
                {players.length} Player{players.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            <div className="space-y-3">
              {players.map((player, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Label className="w-20 text-right">Player {index + 1}:</Label>
                  <Input
                    value={player}
                    onChange={(e) => updatePlayer(index, e.target.value)}
                    placeholder={`Player ${index + 1}`}
                    className="flex-1"
                  />
                  {players.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removePlayer(index)}
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {players.length < 7 && (
              <div className="flex gap-2 items-center">
                <Label className="w-20 text-right">Add:</Label>
                <Input
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="New player name"
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={addPlayer}
                  className="border-success text-success hover:bg-success hover:text-success-foreground"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={onBack}>
                Back to Difficulty
              </Button>
              <Button variant="gaming" className="flex-1" onClick={handleStart}>
                Start Game!
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}