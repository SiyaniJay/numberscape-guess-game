import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import iccLogo from "@/assets/icc-logo.png";

interface PlayerSetupProps {
  onStart: (playerNames: string[]) => void;
}

export function PlayerSetup({ onStart }: PlayerSetupProps) {
  const [players, setPlayers] = useState<string[]>(["Player 1", "Player 2"]);

  const updatePlayer = (index: number, name: string) => {
    const updated = [...players];
    updated[index] = name || `Player ${index + 1}`;
    setPlayers(updated);
  };

  const handleStart = () => {
    const validPlayers = players.map(name => name.trim() || `Player ${players.indexOf(name) + 1}`);
    onStart(validPlayers);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-slide-up">
        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img src={iccLogo} alt="ICC Logo" className="h-16 w-auto" />
            </div>
            <CardTitle className="text-3xl bg-gradient-gaming bg-clip-text text-transparent">
              ICC Number Challenge
            </CardTitle>
            <CardDescription className="text-lg">
              Official ICC Format: 1-100 range, 10 attempts each
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex items-center gap-2 justify-center">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                2 Players Required
              </span>
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
                </div>
              ))}
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-sm">Game Rules:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Each player gets up to 10 attempts</li>
                <li>• One free hint per player</li>
                <li>• Win a round to earn 1 point</li>
                <li>• Play multiple rounds or start fresh</li>
              </ul>
            </div>

            <Button variant="gaming" className="w-full" onClick={handleStart}>
              Start ICC Challenge!
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}