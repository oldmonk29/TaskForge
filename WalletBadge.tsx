import { Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/config';

interface WalletBadgeProps {
  balance: number;
  onClick?: () => void;
}

export function WalletBadge({ balance, onClick }: WalletBadgeProps) {
  return (
    <div 
      className="flex items-center bg-dark-700 border border-gold-400 rounded-lg px-3 py-2 space-x-2 hover:bg-gold-400/10 transition-colors cursor-pointer"
      onClick={onClick}
      data-testid="wallet-badge"
    >
      <Wallet className="text-gold-400 w-4 h-4" />
      <span className="font-semibold">{formatCurrency(balance)}</span>
    </div>
  );
}
