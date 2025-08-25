import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { signOutUser } from '@/lib/firebase';
import { formatCurrency, config } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Wallet, Menu, Shield } from 'lucide-react';

export function NavBar() {
  const { appUser, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-dark-900/95 backdrop-blur-lg border-b border-dark-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href={isAuthenticated ? "/dashboard" : "/"}>
              <div className="flex items-center text-2xl font-playfair font-bold text-gold-400 cursor-pointer">
                <Shield className="mr-2" />
                CyberSecure Academy
              </div>
            </Link>
            
            {/* Free Access Banner */}
            {config.FREE_LAUNCH && (
              <div className="hidden md:flex items-center bg-gradient-to-r from-gold-600 to-gold-400 text-black px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                🎉 Limited-Time Free Access
              </div>
            )}
          </div>

          {/* Search & User Menu */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:flex relative">
              <input 
                type="text" 
                placeholder="Search courses..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 w-64 focus:outline-none focus:border-gold-400 transition-colors"
                data-testid="search-input"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            {isAuthenticated && appUser ? (
              <>
                {/* Wallet Badge */}
                <Link href="/account/wallet">
                  <div className="flex items-center bg-dark-700 border border-gold-400 rounded-lg px-3 py-2 space-x-2 hover:bg-gold-400/10 transition-colors cursor-pointer" data-testid="wallet-badge">
                    <Wallet className="text-gold-400 w-4 h-4" />
                    <span className="font-semibold">{formatCurrency(appUser.walletBalancePaise)}</span>
                  </div>
                </Link>

                {/* Profile Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 bg-dark-700 rounded-lg px-3 py-2 hover:bg-dark-600 transition-colors" data-testid="profile-menu">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40`} />
                        <AvatarFallback>{appUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:block">{appUser.name}</span>
                      <Menu className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-dark-800 border-dark-600">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/wallet" className="cursor-pointer">Wallet</Link>
                    </DropdownMenuItem>
                    {appUser.role === 'ADMIN' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">Admin Panel</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/login">
                <Button className="bg-gradient-to-r from-gold-600 to-gold-400 text-black hover:from-gold-500 hover:to-gold-300" data-testid="login-button">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
