import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Wallet, ExternalLink } from 'lucide-react';

interface WalletConnectProps {
  onWalletConnected: (address: string, balance: string) => void;
  isConnected: boolean;
  address: string;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

const WalletConnect = ({ onWalletConnected, isConnected, address }: WalletConnectProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const balance = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [accounts[0], 'latest']
          });
          const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);
          onWalletConnected(accounts[0], balanceInEth.toFixed(4));
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to connect your wallet",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest']
        });
        const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);
        
        onWalletConnected(accounts[0], balanceInEth.toFixed(4));
        
        toast({
          title: "Wallet Connected!",
          description: "Successfully connected to MetaMask",
        });
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    onWalletConnected('', '0');
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-card rounded-lg border border-primary/20">
          <Wallet className="w-4 h-4 text-primary" />
          <span className="text-sm font-mono">{formatAddress(address)}</span>
        </div>
        <Button
          onClick={disconnectWallet}
          variant="outline"
          size="sm"
          className="border-destructive/20 hover:border-destructive/40"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      className="bg-gradient-primary hover:shadow-primary/50 shadow-lg transition-all duration-300 glow-primary"
      size="lg"
    >
      <Wallet className="w-5 h-5 mr-2" />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      <ExternalLink className="w-4 h-4 ml-2" />
    </Button>
  );
};

export default WalletConnect;