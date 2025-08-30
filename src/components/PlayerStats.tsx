import { Trophy, Target, Coins, Zap, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlayerStatsProps {
  stats: {
    wins: number;
    losses: number;
    balance: string;
    points: number;
    gamesPlayed: number;
    winRate: number;
    bestScore: number;
    rank: number;
  };
  address: string;
}

const PlayerStats = ({ stats, address }: PlayerStatsProps) => {
  const formatAddress = (addr: string) => {
    if (!addr) return 'Not Connected';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const statCards = [
    {
      title: 'Wins',
      value: stats.wins,
      icon: Trophy,
      color: 'text-success',
      bgColor: 'bg-success/10',
      glowClass: 'hover:glow-success'
    },
    {
      title: 'Losses',
      value: stats.losses,
      icon: Target,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      glowClass: 'hover:shadow-destructive/30'
    },
    {
      title: 'Balance',
      value: `${stats.balance} MON`,
      icon: Coins,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      glowClass: 'hover:glow-secondary'
    },
    {
      title: 'Experience',
      value: `${stats.points} XP`,
      icon: Zap,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      glowClass: 'hover:glow-primary'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Player Header */}
      <Card className="bg-gradient-card border-primary/20 glow-primary">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span className="gradient-text text-2xl">Your Stats</span>
            <div className="flex items-center gap-2 text-sm bg-gradient-primary px-3 py-1 rounded-full">
              <Award className="w-4 h-4" />
              <span className="text-primary-foreground font-bold">Rank #{stats.rank}</span>
            </div>
          </CardTitle>
          <p className="text-muted-foreground">
            Player: <span className="font-mono text-foreground">{formatAddress(address)}</span>
          </p>
        </CardHeader>
      </Card>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card 
            key={stat.title} 
            className={`bg-gradient-card border-primary/20 transition-all duration-300 hover:scale-105 ${stat.glowClass} cursor-pointer group`}
          >
            <CardContent className="p-6 text-center">
              <div className={`w-12 h-12 mx-auto mb-3 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-card border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <TrendingUp className="w-8 h-8 text-accent mr-2" />
              <div className="text-3xl font-bold text-accent">
                {stats.winRate}%
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Win Rate</div>
            <div className="mt-2 bg-accent/20 rounded-full h-2">
              <div 
                className="bg-gradient-accent h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${stats.winRate}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{stats.gamesPlayed}</div>
            <div className="text-sm text-muted-foreground">Games Played</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-secondary mb-2">{stats.bestScore}</div>
            <div className="text-sm text-muted-foreground">Best Score</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlayerStats;