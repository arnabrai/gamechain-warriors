import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import GameCard from './GameCard';
import { Play, RotateCcw, Trophy } from 'lucide-react';

interface GameBoardProps {
  onGameComplete: (score: number, won: boolean) => void;
  isWalletConnected: boolean;
}

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const GameBoard = ({ onGameComplete, isWalletConnected }: GameBoardProps) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const { toast } = useToast();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameCompleted) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameCompleted]);

  // Initialize game
  const initializeGame = () => {
    const pairs = ['0', '1', '2', '3', '4', '5', '6', '7'];
    const gameCards = [...pairs, ...pairs]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameStarted(true);
    setGameCompleted(false);
    setTimeElapsed(0);
  };

  // Handle card click
  const handleCardClick = (cardId: number) => {
    if (!gameStarted || gameCompleted || flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Flip the card
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      // Check for match after a short delay
      setTimeout(() => {
        const [firstId, secondId] = newFlippedCards;
        const firstCard = cards.find(c => c.id === firstId);
        const secondCard = cards.find(c => c.id === secondId);

        if (firstCard && secondCard && firstCard.value === secondCard.value) {
          // Match found
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true }
              : c
          ));
          setMatchedPairs(prev => prev + 1);
          
          toast({
            title: "Match Found! 🎉",
            description: "Great job! Keep going!",
          });

          // Check if game is complete
          if (matchedPairs + 1 === 8) {
            setGameCompleted(true);
            setGameStarted(false);
            const score = Math.max(1000 - (moves * 10) - (timeElapsed * 2), 100);
            onGameComplete(score, true);
            
            toast({
              title: "Congratulations! 🏆",
              description: `You won with ${moves + 1} moves in ${timeElapsed}s! Score: ${score}`,
            });
          }
        } else {
          // No match
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false }
              : c
          ));
        }
        
        setFlippedCards([]);
      }, 1000);
    }
  };

  const resetGame = () => {
    setCards([]);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameStarted(false);
    setGameCompleted(false);
    setTimeElapsed(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isWalletConnected) {
    return (
      <div className="text-center py-12 px-6 bg-gradient-card rounded-2xl border border-primary/20">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
            <Trophy className="w-12 h-12 text-primary-foreground" />
          </div>
          <h3 className="text-2xl font-bold mb-2 gradient-text">Connect Your Wallet</h3>
          <p className="text-muted-foreground">
            Connect your MetaMask wallet to start playing Monad Fusion and track your progress!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-gradient-card rounded-2xl border border-primary/20">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{moves}</div>
            <div className="text-sm text-muted-foreground">Moves</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">{matchedPairs}/8</div>
            <div className="text-sm text-muted-foreground">Pairs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{formatTime(timeElapsed)}</div>
            <div className="text-sm text-muted-foreground">Time</div>
          </div>
        </div>
        
        <div className="flex gap-3">
          {gameStarted || gameCompleted ? (
            <Button
              onClick={resetGame}
              variant="outline"
              className="border-warning/20 hover:border-warning/40 hover:bg-warning/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          ) : (
            <Button
              onClick={initializeGame}
              className="bg-gradient-primary hover:shadow-primary/50 shadow-lg transition-all duration-300 glow-primary"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Game
            </Button>
          )}
        </div>
      </div>

      {/* Game Grid */}
      {cards.length > 0 && (
        <div className="grid grid-cols-4 gap-4 p-6 bg-gradient-card rounded-2xl border border-primary/20">
          {cards.map((card) => (
            <GameCard
              key={card.id}
              id={card.id}
              value={card.value}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onClick={handleCardClick}
              disabled={!gameStarted || flippedCards.length >= 2}
            />
          ))}
        </div>
      )}

      {/* Game Instructions */}
      {!gameStarted && cards.length === 0 && (
        <div className="text-center py-8 px-6 bg-gradient-card rounded-2xl border border-primary/20">
          <h3 className="text-xl font-bold mb-4 gradient-text">How to Play Monad Fusion</h3>
          <div className="text-muted-foreground space-y-2 max-w-md mx-auto">
            <p>🎯 Find matching pairs by flipping cards</p>
            <p>⚡ Match all 8 pairs to win</p>
            <p>🏆 Earn points based on speed and moves</p>
            <p>💎 Compete on the leaderboard</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;