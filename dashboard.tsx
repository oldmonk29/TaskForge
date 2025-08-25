import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { NavBar } from '@/components/NavBar';
import { Hero } from '@/components/Hero';
import { Carousel } from '@/components/Carousel';
import { SubscriptionPlans } from '@/components/SubscriptionPlans';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import type { Content } from '@shared/schema';

export default function Dashboard() {
  const { isAuthenticated, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { data: content = [], isLoading } = useQuery<Content[]>({
    queryKey: ['/api/content'],
    enabled: isAuthenticated,
  });


  const categorizeContent = (content: Content[]) => {
    const categories = {
      trending: content.filter(item => item.category === 'Trending').slice(0, 8),
      featured: content.filter(item => item.category === 'Featured').slice(0, 8),
      new: content.filter(item => item.category === 'New').slice(0, 8),
    };

    // If no specific categories, distribute content
    if (categories.trending.length === 0 && categories.featured.length === 0 && categories.new.length === 0) {
      const shuffled = [...content].sort(() => 0.5 - Math.random());
      categories.trending = shuffled.slice(0, 8);
      categories.featured = shuffled.slice(8, 16);
      categories.new = shuffled.slice(16, 24);
    }

    return categories;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-gold-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-900 text-white">
        <NavBar />
        <Hero onAuthClick={() => setShowAuthModal(true)} />
        <div className="py-16">
          <SubscriptionPlans />
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  const { trending, featured, new: newContent } = categorizeContent(content);

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <NavBar />
      
      <main className="pt-16">
        {/* Dashboard Content */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          {isLoading ? (
            <div className="text-center text-gold-400">Loading content...</div>
          ) : (
            <>
              {trending.length > 0 && (
                <Carousel 
                  title="Trending Now" 
                  content={trending}
                  onViewAll={() => {/* TODO: Navigate to category page */}}
                />
              )}
              
              {featured.length > 0 && (
                <Carousel 
                  title="Featured Courses" 
                  content={featured}
                  onViewAll={() => {/* TODO: Navigate to category page */}}
                />
              )}
              
              {newContent.length > 0 && (
                <Carousel 
                  title="New Releases" 
                  content={newContent}
                  onViewAll={() => {/* TODO: Navigate to category page */}}
                />
              )}

              {content.length === 0 && (
                <div className="text-center py-16">
                  <h2 className="text-2xl font-bold mb-4">No content available</h2>
                  <p className="text-gray-400">Check back soon for new courses!</p>
                </div>
              )}
            </>
          )}
        </section>

        <SubscriptionPlans />
      </main>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
