import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DIFFICULTIES, GameDifficulty } from "@/types/game";

interface DifficultySelectorProps {
  onSelect: (difficulty: GameDifficulty) => void;
}

export function DifficultySelector({ onSelect }: DifficultySelectorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold bg-gradient-gaming bg-clip-text text-transparent mb-4 text-glow">
            NUMBERSCAPE
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose your difficulty and enter the arena
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(DIFFICULTIES).map((diff, index) => (
            <Card 
              key={diff.name}
              className="hover:scale-105 transition-all duration-300 cursor-pointer group border-primary/20 hover:border-primary/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <CardTitle className="text-2xl flex items-center justify-between">
                  <span className="capitalize">{diff.name}</span>
                  <span className="text-lg">{diff.tag}</span>
                </CardTitle>
                <CardDescription className="text-base">
                  {diff.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Range</p>
                    <p className="text-primary font-bold">
                      {diff.range[0]} - {diff.range[1]}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Max Attempts</p>
                    <p className="text-accent font-bold">
                      {diff.maxAttempts}
                    </p>
                  </div>
                </div>
                
                <Button 
                  variant="gaming"
                  size="lg"
                  className="w-full group-hover:animate-pulse-glow"
                  onClick={() => onSelect(diff)}
                >
                  Enter Arena
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}