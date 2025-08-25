import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { config } from '@/lib/config';
import { apiRequest } from '@/lib/queryClient';
import type { Ad } from '@shared/schema';

interface AdSlotProps {
  placement: string;
}

export function AdSlot({ placement }: AdSlotProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentAd, setCurrentAd] = useState<Ad | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!config.SHOW_ADS) return;

    const fetchAds = async () => {
      try {
        const response = await apiRequest('GET', `/api/ads/${placement}`);
        const adsData = await response.json();
        setAds(adsData);
        
        if (adsData.length > 0) {
          // Simple random selection based on weight
          const weightedAds = adsData.flatMap((ad: Ad) => 
            Array(ad.weight).fill(ad)
          );
          const randomAd = weightedAds[Math.floor(Math.random() * weightedAds.length)];
          setCurrentAd(randomAd);
        }
      } catch (error) {
        console.error('Failed to fetch ads:', error);
      }
    };

    fetchAds();
  }, [placement]);

  const handleAdClick = async () => {
    if (currentAd) {
      try {
        await apiRequest('POST', `/api/ads/${currentAd.id}/click`);
        window.open(currentAd.linkUrl, '_blank');
      } catch (error) {
        console.error('Failed to track ad click:', error);
      }
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!config.SHOW_ADS || !currentAd || !isVisible) {
    return null;
  }

  return (
    <div className="mt-6 bg-gradient-to-r from-dark-700 to-dark-600 border border-gold-400/30 rounded-xl p-6" data-testid={`ad-slot-${placement}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400 uppercase tracking-wide">Sponsored Content</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-300 p-1"
          data-testid="ad-close-button"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
      
      <div 
        className="flex items-center space-x-4 cursor-pointer hover:bg-white/5 rounded-lg p-2 transition-colors"
        onClick={handleAdClick}
        data-testid="ad-content"
      >
        <img 
          src={currentAd.imageUrl} 
          alt={currentAd.title} 
          className="w-24 h-16 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-gold-400 mb-1">{currentAd.title}</h4>
          {currentAd.description && (
            <p className="text-sm text-gray-300 mb-2">{currentAd.description}</p>
          )}
          <Button 
            size="sm"
            className="bg-gold-400 text-black hover:bg-gold-300 transition-colors"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
