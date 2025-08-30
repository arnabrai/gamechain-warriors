import { Trophy, Medal, Award, Crown, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LeaderboardEntry {
  rank: number;
  address: string;
  wins: number;
  points: number;
  winRate: number;
  bestScore: number;
}

interface LeaderboardProps {
  players: LeaderboardEntry[];
  currentPlayerAddress?: string;
}

const Leaderboard = ({ players, currentPlayerAddress }: LeaderboardProps) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <Star className="w-5 h-5 text-primary" />;
    }
  };

  const getRankBadgeVariant = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-black';
      case 3:
        return 'bg-gradient-to-r from-amber-500 to-amber-700 text-white';
      default:
        return 'bg-gradient-primary text-primary-foreground';
    }
  };

  const getRowGlow = (rank: number, isCurrentPlayer: boolean) => {
    if (isCurrentPlayer) return 'glow-accent border-accent/50';
    if (rank <= 3) return 'glow-primary border-primary/30';
    return 'border-border/30';
  };

  return (
    <Card className="bg-gradient-card border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="gradient-text text-2xl">Leaderboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {players.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Players Yet</h3>
            <p className="text-muted-foreground">
              Be the first to play and claim the top spot!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {players.map((player) => {
              const isCurrentPlayer = player.address === currentPlayerAddress;
              
              return (
                <div
                  key={player.address}
                  className={`
                    flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 hover:scale-102
                    ${getRowGlow(player.rank, isCurrentPlayer)}
                    ${isCurrentPlayer ? 'bg-accent/5' : 'bg-gradient-card'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="flex items-center gap-2">
                      <Badge className={`px-3 py-1 font-bold ${getRankBadgeVariant(player.rank)}`}>
                        #{player.rank}
                      </Badge>
                      {getRankIcon(player.rank)}
                    </div>

                    {/* Player Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold">
                          {formatAddress(player.address)}
                        </span>
                        {isCurrentPlayer && (
                          <Badge variant="outline" className="text-xs border-accent text-accent">
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {player.wins} wins • {player.winRate}% win rate
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">
                      {player.points} XP
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Best: {player.bestScore}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Leaderboard Footer */}
        {players.length > 0 && (
          <div className="mt-6 p-4 bg-muted/10 rounded-xl border border-border/50">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>🏆 Top players get special rewards</span>
              <span>Updates in real-time</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;