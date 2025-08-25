import { useState } from 'react';
import { Check, X, Crown, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, subscriptionTiers } from '@/lib/config';

export function SubscriptionPlans() {
  const { appUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePlanSelect = (planId: string, price: number) => {
    setSelectedPlan(planId);
    // TODO: Implement Razorpay payment flow
    console.log('Selected plan:', planId, 'Price:', price);
  };

  const getDiscountedPrice = (originalPrice: number) => {
    if (!appUser) return originalPrice;
    return Math.max(0, originalPrice - appUser.walletBalancePaise);
  };

  const canAffordWithWallet = (price: number) => {
    if (!appUser) return false;
    return appUser.walletBalancePaise >= price;
  };

  return (
    <section className="py-20 bg-dark-900 border-t border-dark-600">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-playfair font-bold mb-4">
            Choose Your <span className="text-gold-400">Learning Path</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Unlock premium content and accelerate your cybersecurity career
          </p>
          
          {appUser && (
            <div className="inline-flex items-center bg-dark-800 border border-gold-400/50 rounded-full px-6 py-3 mb-8">
              <span className="text-sm">
                Use your {formatCurrency(appUser.walletBalancePaise)} welcome bonus towards any plan
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subscriptionTiers.map((tier, index) => {
            const discountedPrice = getDiscountedPrice(tier.price);
            const canAfford = canAffordWithWallet(tier.price);

            return (
              <div 
                key={tier.id}
                className={`bg-dark-800 rounded-2xl p-8 relative ${
                  tier.popular ? 'border-2 border-gold-400 transform scale-105' : 'border border-dark-600'
                }`}
                data-testid={`subscription-plan-${tier.id}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gold-600 to-gold-400 text-black px-6 py-2 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <div className="mb-4">
                    {index === 0 && <Users className="w-12 h-12 text-blue-400 mx-auto" />}
                    {index === 1 && <Crown className="w-12 h-12 text-gold-400 mx-auto" />}
                    {index === 2 && <Zap className="w-12 h-12 text-purple-400 mx-auto" />}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="text-4xl font-bold mb-4">
                    <span className="text-gold-400">{formatCurrency(tier.price)}</span>
                    <span className="text-lg font-normal text-gray-400">/month</span>
                  </div>
                  <p className="text-gray-400">
                    {tier.id === 'FREEMIUM' && 'Ad-supported access to basic content'}
                    {tier.id === 'PREMIUM' && 'Full access + certifications'}
                    {tier.id === 'ADVISORY' && '1-on-1 mentorship included'}
                  </p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className={`w-5 h-5 ${tier.popular ? 'text-gold-400' : 'text-green-400'}`} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                  {tier.limitations?.map((limitation, limitationIndex) => (
                    <li key={limitationIndex} className="flex items-center space-x-3">
                      <X className="w-5 h-5 text-red-400" />
                      <span className="text-sm text-gray-500">{limitation}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full py-3 font-semibold ${
                    tier.popular
                      ? 'bg-gradient-to-r from-gold-600 to-gold-400 text-black hover:from-gold-500 hover:to-gold-300'
                      : canAfford
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-dark-700 border border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-black'
                  } transition-all`}
                  onClick={() => handlePlanSelect(tier.id, tier.price)}
                  disabled={selectedPlan === tier.id}
                  data-testid={`select-plan-${tier.id}`}
                >
                  {canAfford ? (
                    <>
                      <span className="line-through text-sm">{formatCurrency(tier.price)}</span>
                      <span className="ml-2">FREE with bonus!</span>
                    </>
                  ) : discountedPrice < tier.price ? (
                    <>
                      {formatCurrency(discountedPrice)} after bonus
                    </>
                  ) : (
                    `Select ${tier.name}`
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Wallet Redemption Notice */}
        {appUser && (
          <div className="text-center mt-12">
            <div className="inline-flex items-center bg-gradient-to-r from-gold-600/20 to-gold-400/20 border border-gold-400/50 rounded-xl px-8 py-4">
              <div className="text-left">
                <h4 className="font-semibold text-lg">
                  Your Wallet Balance: <span className="text-gold-400">{formatCurrency(appUser.walletBalancePaise)}</span>
                </h4>
                <p className="text-sm text-gray-300">Welcome bonus automatically applied at checkout</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
