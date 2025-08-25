import { Button } from '@/components/ui/button';
import { Gift, Play, Clock } from 'lucide-react';
import { config, formatCurrency } from '@/lib/config';

interface HeroProps {
  onAuthClick: () => void;
}

export function Hero({ onAuthClick }: HeroProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 leading-tight">
          Master <span className="text-gold-400">Cybersecurity</span><br />
          Like Never Before
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
          Join India's premier cybersecurity training platform. Learn from experts, earn certificates, and secure your future in the digital world.
        </p>
        
        {/* Welcome Bonus CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-gold-600 to-gold-400 text-black px-8 py-4 font-bold text-lg hover:from-gold-500 hover:to-gold-300 transform hover:scale-105 transition-all shadow-lg"
            onClick={onAuthClick}
            data-testid="claim-bonus-button"
          >
            <Gift className="mr-2" />
            Claim {formatCurrency(config.WELCOME_BONUS_PAISE)} Welcome Bonus
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="border-2 border-gold-400 text-gold-400 px-8 py-4 font-semibold text-lg hover:bg-gold-400 hover:text-black transition-colors"
            data-testid="watch-demo-button"
          >
            <Play className="mr-2" />
            Watch Demo
          </Button>
        </div>

        {/* Free Access Notice */}
        {config.FREE_LAUNCH && (
          <div className="bg-dark-800/80 backdrop-blur border border-gold-400/50 rounded-xl p-6 max-w-md mx-auto">
            <Clock className="text-gold-400 text-2xl mb-2 mx-auto" />
            <h3 className="font-semibold text-lg mb-2">Limited Time Offer</h3>
            <p className="text-sm text-gray-300">All premium content free for the next 90 days. No credit card required.</p>
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="text-gold-400 text-2xl">⌄</div>
      </div>
    </section>
  );
}
