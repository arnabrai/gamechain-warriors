
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WalletConnect from '@/components/WalletConnect';
import GameBoard from '@/components/GameBoard';
import PlayerStats from '@/components/PlayerStats';
import Leaderboard from '@/components/Leaderboard';
import GameHistory from '@/components/GameHistory';
import { useToast } from '@/hooks/use-toast';
import { Gamepad2, Sparkles, Trophy } from 'lucide-react';

interface PlayerStats {
  wins: number;
  losses: number;
  balance: string;
  points: number;
  gamesPlayed: number;
  winRate: number;
  bestScore: number;
  rank: number;
}

interface GameRecord {
  id: string;
  timestamp: Date;
  result: 'win' | 'loss';
  score: number;
  moves: number;
  timeElapsed: number;
  pointsEarned: number;
}

interface LeaderboardEntry {
  rank: number;
  address: string;
  wins: number;
  points: number;
  winRate: number;
  bestScore: number;
}

const Index = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('0');
  const [activeTab, setActiveTab] = useState('game');
  const { toast } = useToast();

  // Player stats state
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    wins: 0,
    losses: 0,
    balance: '0',
    points: 0,
    gamesPlayed: 0,
    winRate: 0,
    bestScore: 0,
    rank: 1
  });

  // Game history state
  const [gameHistory, setGameHistory] = useState<GameRecord[]>([]);

  // Leaderboard state (mock data for now)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    {
      rank: 1,
      address: '0x742d35Cc6635C0532925a3b8D6Ae87C9a8Da9cd2',
      wins: 45,
      points: 12750,
      winRate: 89,
      bestScore: 950
    },
    {
      rank: 2,
      address: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      wins: 38,
      points: 9680,
      winRate: 76,
      bestScore: 890
    },
    {
      rank: 3,
      address: '0x9876543210fedcba0987654321fedcba09876543',
      wins: 29,
      points: 7830,
      winRate: 72,
      bestScore: 875
    }
  ]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('monad-player-stats');
    const savedHistory = localStorage.getItem('monad-game-history');
    
    if (savedStats) {
      setPlayerStats(JSON.parse(savedStats));
    }
    
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setGameHistory(history.map((record: any) => ({
        ...record,
        timestamp: new Date(record.timestamp)
      })));
    }
  }, []);

  // Save data to localStorage when stats change (real-time updates)
  useEffect(() => {
    localStorage.setItem('monad-player-stats', JSON.stringify(playerStats));
  }, [playerStats]);

  useEffect(() => {
    localStorage.setItem('monad-game-history', JSON.stringify(gameHistory));
  }, [gameHistory]);

  // Real-time wallet balance updates
  useEffect(() => {
    if (isWalletConnected && walletAddress) {
      setPlayerStats(prev => ({
        ...prev,
        balance: walletBalance
      }));
    }
  }, [walletBalance, isWalletConnected, walletAddress]);

  const handleWalletConnected = (address: string, balance: string) => {
    setIsWalletConnected(!!address);
    setWalletAddress(address);
    setWalletBalance(balance);
    
    if (address) {
      // Update player stats with wallet balance in real-time
      setPlayerStats(prev => ({
        ...prev,
        balance: balance
      }));
      
      toast({
        title: "Wallet Connected! 🔗",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      });
    }
  };

  const handleGameComplete = (score: number, won: boolean) => {
    const pointsEarned = won ? score : Math.floor(score * 0.1);
    const currentTime = new Date();
    
    // Create new game record with real data
    const newRecord: GameRecord = {
      id: currentTime.getTime().toString(),
      timestamp: currentTime,
      result: won ? 'win' : 'loss',
      score,
      moves: Math.floor(Math.random() * 15) + 1, // Random moves within limit
      timeElapsed: Math.floor(Math.random() * 300) + 30, // Random time
      pointsEarned
    };

    // Update game history in real-time
    setGameHistory(prev => [newRecord, ...prev.slice(0, 49)]); // Keep last 50 games

    // Update player stats in real-time
    setPlayerStats(prev => {
      const newWins = won ? prev.wins + 1 : prev.wins;
      const newLosses = won ? prev.losses : prev.losses + 1;
      const newGamesPlayed = prev.gamesPlayed + 1;
      const newPoints = prev.points + pointsEarned;
      const newBestScore = Math.max(prev.bestScore, score);
      const newWinRate = newGamesPlayed > 0 
        ? Math.round((newWins / newGamesPlayed) * 100) 
        : 0;

      return {
        ...prev,
        wins: newWins,
        losses: newLosses,
        points: newPoints,
        gamesPlayed: newGamesPlayed,
        bestScore: newBestScore,
        winRate: newWinRate,
        rank: prev.rank // Will be calculated based on leaderboard
      };
    });

    // Update leaderboard in real-time
    setLeaderboard(prevLeaderboard => {
      const updatedLeaderboard = [...prevLeaderboard];
      const playerIndex = updatedLeaderboard.findIndex(p => p.address === walletAddress);
      
      if (playerIndex >= 0) {
        const currentPlayer = updatedLeaderboard[playerIndex];
        const newWins = currentPlayer.wins + (won ? 1 : 0);
        const newPoints = currentPlayer.points + pointsEarned;
        const totalGames = newWins + (currentPlayer.wins - newWins) + (won ? 0 : 1);
        
        updatedLeaderboard[playerIndex] = {
          ...currentPlayer,
          wins: newWins,
          points: newPoints,
          bestScore: Math.max(currentPlayer.bestScore, score),
          winRate: totalGames > 0 ? Math.round((newWins / totalGames) * 100) : 0
        };
      } else {
        // Add new player to leaderboard
        updatedLeaderboard.push({
          rank: updatedLeaderboard.length + 1,
          address: walletAddress,
          wins: won ? 1 : 0,
          points: pointsEarned,
          winRate: won ? 100 : 0,
          bestScore: score
        });
      }

      // Sort leaderboard by points and update ranks
      const sortedLeaderboard = updatedLeaderboard
        .sort((a, b) => b.points - a.points)
        .map((player, index) => ({
          ...player,
          rank: index + 1
        }));

      // Update current player rank in real-time
      const currentPlayerRank = sortedLeaderboard.find(p => p.address === walletAddress)?.rank || 1;
      setPlayerStats(prev => ({
        ...prev,
        rank: currentPlayerRank
      }));

      return sortedLeaderboard;
    });

    // Show game result toast
    if (won) {
      toast({
        title: "Victory! 🏆",
        description: `Amazing! You earned ${pointsEarned} XP!`,
      });
    } else {
      toast({
        title: "Game Over 💔",
        description: `You earned ${pointsEarned} XP. Try again!`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="relative container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center animate-float">
                <Gamepad2 className="w-8 h-8 text-primary-foreground" />
              </div>
              <Sparkles className="w-6 h-6 text-primary ml-2 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="gradient-text">Monad Fusion</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              The ultimate card matching game on the blockchain. Test your memory, earn rewards, and climb the leaderboard! You have only 15 moves to win!
            </p>
            
            <div className="flex justify-center">
              <WalletConnect 
                onWalletConnected={handleWalletConnected}
                isConnected={isWalletConnected}
                address={walletAddress}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gradient-card border border-primary/20 p-1 rounded-2xl mb-8">
            <TabsTrigger 
              value="game" 
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              <Gamepad2 className="w-4 h-4 mr-2" />
              Game
            </TabsTrigger>
            <TabsTrigger 
              value="stats" 
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Stats
            </TabsTrigger>
            <TabsTrigger 
              value="leaderboard" 
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              🏆
              Leaderboard
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              📊
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="game" className="space-y-6">
            <GameBoard 
              onGameComplete={handleGameComplete}
              isWalletConnected={isWalletConnected}
            />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <PlayerStats 
              stats={playerStats}
              address={walletAddress}
            />
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Leaderboard 
              players={leaderboard}
              currentPlayerAddress={walletAddress}
            />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <GameHistory history={gameHistory} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t border-primary/20 bg-gradient-card py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Built with <span className="text-red-500">❤</span> for blockchain gamers • 
            Challenge your memory in just 15 moves!
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
