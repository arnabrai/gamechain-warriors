# Monad Fusion

A blockchain-based card matching game with MetaMask wallet integration and real-time leaderboards.

## 🎮 Game Features

- **Card Matching Game**: Match pairs of cards within 15 moves
- **MetaMask Integration**: Connect your wallet to play and track stats
- **Real-time Leaderboard**: Compete with other players globally  
- **Player Stats**: Track wins, losses, XP, and wallet balance
- **Game History**: View your complete game record
- **Beautiful UI**: Futuristic dark theme with smooth animations

## 🚀 How to Play

1. **Connect Wallet**: Click "Connect Wallet" to link your MetaMask
2. **Start Game**: Click "Start New Game" to begin
3. **Match Cards**: Flip cards to find matching pairs
4. **Win**: Complete all pairs within 15 moves to win XP and climb the leaderboard

## 🛠️ Development

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- MetaMask browser extension

### Setup

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd monad-fusion

# Install dependencies
npm install

# Start development server
npm run dev
```

### Technologies Used

- **React** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **ethers.js** for blockchain interaction
- **Lucide React** for icons

## 🎯 Game Rules

- Match all card pairs to win
- You have exactly 15 moves to complete the game
- Each successful match earns you XP
- Climb the leaderboard by winning games
- Your stats are tied to your connected wallet

## 🏆 Scoring System

- **Win**: +100 XP
- **Loss**: No XP penalty
- **Leaderboard**: Ranked by total XP earned
- **Stats**: Persistent across sessions via wallet connection