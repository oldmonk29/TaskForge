import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { NavBar } from '@/components/NavBar';
import { VideoPlayer } from '@/components/VideoPlayer';
import { useAuth } from '@/hooks/useAuth';
import { config } from '@/lib/config';
import type { Content } from '@shared/schema';

export default function Watch() {
  const [, params] = useRoute('/watch/:slug');
  const { isAuthenticated, loading } = useAuth();
  const slug = params?.slug;

  const { data: content, isLoading, error } = useQuery<Content>({
    queryKey: ['/api/content', slug],
    enabled: !!slug,
  });

  if (loading || isLoading) {
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
        <div className="pt-16 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-gray-400">Please sign in to watch this content.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-dark-900 text-white">
        <NavBar />
        <div className="pt-16 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Content Not Found</h1>
            <p className="text-gray-400">The requested content could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if content is premium and not in free launch mode
  const isPremiumLocked = content.isPremium && !config.FREE_LAUNCH;

  if (isPremiumLocked) {
    return (
      <div className="min-h-screen bg-dark-900 text-white">
        <NavBar />
        <div className="pt-16 flex items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="bg-dark-800 rounded-xl p-8 border border-gold-400/50">
              <h1 className="text-2xl font-bold mb-4">Premium Content</h1>
              <p className="text-gray-400 mb-6">This content requires a premium subscription to access.</p>
              <div className="space-y-4">
                <button className="w-full bg-gradient-to-r from-gold-600 to-gold-400 text-black py-3 rounded-lg font-semibold hover:from-gold-500 hover:to-gold-300 transition-all">
                  Upgrade to Premium
                </button>
                <button className="w-full border border-gold-400 text-gold-400 py-3 rounded-lg font-semibold hover:bg-gold-400 hover:text-black transition-colors">
                  View Subscription Plans
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <NavBar />
      
      <main className="pt-16">
        <section className="py-16">
          <VideoPlayer content={content} />
        </section>
      </main>
    </div>
  );
}
