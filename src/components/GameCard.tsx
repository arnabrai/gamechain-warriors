import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface GameCardProps {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: (id: number) => void;
  disabled: boolean;
}

const cardSymbols = ['🚀', '⚡', '💎', '🌟', '🔥', '💫', '🎯', '🎮'];

const GameCard = ({ id, value, isFlipped, isMatched, onClick, disabled }: GameCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isFlipped || isMatched) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isFlipped, isMatched]);

  return (
    <div
      className={cn(
        "relative w-20 h-20 cursor-pointer perspective-1000 transition-transform duration-200 hover:scale-105",
        disabled && "cursor-not-allowed opacity-50"
      )}
      onClick={() => !disabled && onClick(id)}
    >
      <div
        className={cn(
          "absolute inset-0 w-full h-full transition-transform duration-600 transform-style-preserve-3d",
          (isFlipped || isMatched) && "rotate-y-180",
          isAnimating && "animate-card-flip"
        )}
      >
        {/* Card Back */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="w-full h-full bg-gradient-card border-2 border-primary/30 rounded-xl flex items-center justify-center relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="text-2xl font-bold text-primary/60">?</div>
            <div className="absolute inset-0 bg-shimmer opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer" 
                 style={{
                   background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                   backgroundSize: '200% 100%'
                 }} 
            />
          </div>
        </div>

        {/* Card Front */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className={cn(
            "w-full h-full rounded-xl flex items-center justify-center border-2 transition-all duration-300",
            isMatched 
              ? "bg-gradient-to-br from-success/20 to-success/10 border-success glow-success" 
              : "bg-gradient-card border-accent/50 glow-accent"
          )}>
            <span className="text-3xl animate-float" style={{ animationDelay: `${id * 0.1}s` }}>
              {cardSymbols[parseInt(value)]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;