import { Clock, Trophy, Target, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GameRecord {
  id: string;
  timestamp: Date;
  result: 'win' | 'loss';
  score: number;
  moves: number;
  timeElapsed: number;
  pointsEarned: number;
}

interface GameHistoryProps {
  history: GameRecord[];
}

const GameHistory = ({ history }: GameHistoryProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="bg-gradient-card border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-accent-foreground" />
          </div>
          <span className="gradient-text text-2xl">Game History</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
              <Clock className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Games Played</h3>
            <p className="text-muted-foreground">
              Start playing to see your game history here!
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {history.map((game) => (
              <div
                key={game.id}
                className={`
                  flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 hover:scale-102
                  ${game.result === 'win' 
                    ? 'bg-success/5 border-success/30 hover:glow-success' 
                    : 'bg-destructive/5 border-destructive/30'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  {/* Result Icon */}
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center
                    ${game.result === 'win' ? 'bg-success/20' : 'bg-destructive/20'}
                  `}>
                    {game.result === 'win' ? (
                      <Trophy className="w-5 h-5 text-success" />
                    ) : (
                      <Target className="w-5 h-5 text-destructive" />
                    )}
                  </div>

                  {/* Game Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge 
                        variant={game.result === 'win' ? 'default' : 'destructive'}
                        className={game.result === 'win' ? 'bg-success text-success-foreground' : ''}
                      >
                        {game.result === 'win' ? 'Victory' : 'Defeat'}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(game.timestamp)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {game.moves} moves • {formatTime(game.timeElapsed)}
                    </div>
                  </div>
                </div>

                {/* Game Stats */}
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    {game.score}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    +{game.pointsEarned} XP
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* History Stats */}
        {history.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/10 rounded-xl">
              <div className="text-2xl font-bold text-success">
                {history.filter(g => g.result === 'win').length}
              </div>
              <div className="text-xs text-muted-foreground">Total Wins</div>
            </div>
            <div className="text-center p-3 bg-muted/10 rounded-xl">
              <div className="text-2xl font-bold text-primary">
                {Math.round(history.reduce((acc, g) => acc + g.score, 0) / history.length)}
              </div>
              <div className="text-xs text-muted-foreground">Avg Score</div>
            </div>
            <div className="text-center p-3 bg-muted/10 rounded-xl">
              <div className="text-2xl font-bold text-accent">
                {Math.max(...history.map(g => g.score))}
              </div>
              <div className="text-xs text-muted-foreground">Best Score</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameHistory;