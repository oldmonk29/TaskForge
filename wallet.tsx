import { useQuery } from '@tanstack/react-query';
import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/lib/config';
import { Wallet, CreditCard, Gift, Clock, TrendingUp, Award, Flame, ArrowUp, ArrowDown } from 'lucide-react';
import type { Transaction, Purchase, Certificate } from '@shared/schema';

export default function WalletPage() {
  const { appUser, isAuthenticated, loading } = useAuth();

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ['/api/users', appUser?.id, 'transactions'],
    enabled: !!appUser?.id,
  });

  const { data: purchases = [] } = useQuery<Purchase[]>({
    queryKey: ['/api/users', appUser?.id, 'purchases'],
    enabled: !!appUser?.id,
  });

  const { data: certificates = [] } = useQuery<Certificate[]>({
    queryKey: ['/api/users', appUser?.id, 'certificates'],
    enabled: !!appUser?.id,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-gold-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !appUser) {
    return (
      <div className="min-h-screen bg-dark-900 text-white">
        <NavBar />
        <div className="pt-16 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-gray-400">Please sign in to view your wallet.</p>
          </div>
        </div>
      </div>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'BONUS':
        return <Gift className="w-6 h-6 text-green-400" />;
      case 'PURCHASE':
        return <ArrowDown className="w-6 h-6 text-red-400" />;
      case 'TOPUP':
        return <ArrowUp className="w-6 h-6 text-green-400" />;
      case 'REWARD':
        return <Award className="w-6 h-6 text-gold-400" />;
      case 'REFUND':
        return <ArrowUp className="w-6 h-6 text-blue-400" />;
      default:
        return <CreditCard className="w-6 h-6 text-gray-400" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'BONUS':
      case 'TOPUP':
      case 'REWARD':
      case 'REFUND':
        return 'text-green-400';
      case 'PURCHASE':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTransactionSign = (type: string) => {
    switch (type) {
      case 'BONUS':
      case 'TOPUP':
      case 'REWARD':
      case 'REFUND':
        return '+';
      case 'PURCHASE':
        return '-';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <NavBar />
      
      <main className="pt-16">
        <section className="py-16 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-playfair font-bold mb-4">
              Your <span className="text-gold-400">Digital Wallet</span>
            </h1>
            <p className="text-gray-300">Manage your balance and track transactions</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            
            {/* Wallet Balance Card */}
            <Card className="bg-gradient-to-br from-gold-600 to-gold-400 text-black border-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-12 -translate-x-12"></div>
              
              <CardContent className="relative z-10 p-8">
                <div className="flex items-center justify-between mb-6">
                  <CardTitle className="text-xl font-bold">Wallet Balance</CardTitle>
                  <Wallet className="w-8 h-8" />
                </div>
                
                <div className="mb-4">
                  <div className="text-4xl font-bold mb-2" data-testid="wallet-balance">
                    {formatCurrency(appUser.walletBalancePaise)}
                  </div>
                  <p className="text-sm opacity-80">Available for purchases</p>
                </div>

                <div className="flex space-x-3">
                  <Button 
                    className="bg-black/20 backdrop-blur hover:bg-black/30 text-black border-0"
                    data-testid="add-funds-button"
                  >
                    Add Funds
                  </Button>
                  <Button 
                    className="bg-white/20 backdrop-blur hover:bg-white/30 text-black border-0"
                    data-testid="transfer-button"
                  >
                    Transfer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="space-y-4">
              <Card className="bg-dark-800 border-dark-600">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-semibold mb-1 text-gray-300">Courses Purchased</CardTitle>
                      <div className="text-2xl font-bold text-gold-400">{purchases.length}</div>
                    </div>
                    <CreditCard className="w-8 h-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-dark-800 border-dark-600">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-semibold mb-1 text-gray-300">Certificates Earned</CardTitle>
                      <div className="text-2xl font-bold text-gold-400">{certificates.length}</div>
                    </div>
                    <Award className="w-8 h-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-dark-800 border-dark-600">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-semibold mb-1 text-gray-300">Learning Streak</CardTitle>
                      <div className="text-2xl font-bold text-gold-400">{appUser.streakCount} days</div>
                    </div>
                    <Flame className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Transaction History */}
          <Card className="bg-dark-800 border-dark-600">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <div className="divide-y divide-dark-600">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="py-6 flex items-center justify-between" data-testid={`transaction-${transaction.id}`}>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-dark-700 rounded-full flex items-center justify-center">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg capitalize">
                            {transaction.type.toLowerCase().replace('_', ' ')}
                          </h4>
                          <p className="text-sm text-gray-400">{transaction.note}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.createdAt).toLocaleDateString()} • {new Date(transaction.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-semibold ${getTransactionColor(transaction.type)}`}>
                          {getTransactionSign(transaction.type)}{formatCurrency(transaction.amountPaise)}
                        </div>
                        <Badge variant="outline" className="text-xs border-gray-600">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
                  <p className="text-gray-400">Your transaction history will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
