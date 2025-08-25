import { useState } from 'react';
import { X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithGoogle();
      if (result) {
        toast({
          title: "Welcome!",
          description: "Successfully signed in with Google. Your ₹500 bonus will be credited shortly.",
        });
        onClose();
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      if (isSignUp) {
        await signUpWithEmail(email, password);
        toast({
          title: "Account Created",
          description: "Welcome! Your ₹500 bonus will be credited shortly.",
        });
      } else {
        await signInWithEmail(email, password);
        toast({
          title: "Welcome Back",
          description: "Successfully signed in!",
        });
      }
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-800 border-dark-600 max-w-md" data-testid="auth-modal">
        <DialogHeader>
          <DialogTitle className="text-center flex flex-col items-center space-y-4">
            <Shield className="text-gold-400 w-12 h-12" />
            <div>
              <h2 className="text-2xl font-playfair font-bold mb-2">
                {isSignUp ? 'Join CyberSecure Academy' : 'Welcome Back'}
              </h2>
            </div>
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            {isSignUp ? 'Start your cybersecurity journey today' : 'Continue your learning path'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Social Login */}
          <div className="space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 bg-white text-black hover:bg-gray-100 transition-colors"
              data-testid="google-signin-button"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </Button>
            
            <div className="text-center text-gray-400">
              <span>or</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-dark-700 border-dark-600 focus:border-gold-400"
                  data-testid="name-input"
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-dark-700 border-dark-600 focus:border-gold-400"
                required
                data-testid="email-input"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-dark-700 border-dark-600 focus:border-gold-400"
                required
                data-testid="password-input"
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-gold-600 to-gold-400 text-black hover:from-gold-500 hover:to-gold-300 transition-all"
              data-testid="submit-auth-button"
            >
              {isLoading ? 'Please wait...' : isSignUp ? 'Create Account & Get ₹500 Bonus' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={toggleMode}
                className="text-gold-400 hover:text-gold-300 font-semibold"
                data-testid="toggle-auth-mode"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2"
          data-testid="close-auth-modal"
        >
          <X className="w-4 h-4" />
        </Button>
      </DialogContent>
    </Dialog>
  );
}
