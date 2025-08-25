import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatCurrency, config } from '@/lib/config';
import type { Content } from '@shared/schema';

interface CardProps {
  content: Content;
}

export function Card({ content }: CardProps) {
  const getContentBadge = () => {
    if (content.isPremium && !config.FREE_LAUNCH) {
      return <Badge className="bg-gold-400 text-black">PREMIUM</Badge>;
    }
    return <Badge className="bg-green-600 text-white">FREE</Badge>;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <Link href={`/watch/${content.slug}`}>
      <div className="flex-none w-80 bg-dark-800 rounded-xl overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-gold-400/20" data-testid={`content-card-${content.slug}`}>
        <div className="relative">
          <img 
            src={content.thumbnailUrl} 
            alt={content.title} 
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badge */}
          <div className="absolute top-3 left-3">
            {getContentBadge()}
          </div>
          
          {/* Duration */}
          {content.duration && (
            <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-sm">
              {formatDuration(content.duration)}
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-gold-400 transition-colors">
            {content.title}
          </h3>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {content.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={content.instructorImage || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32`} />
                <AvatarFallback>{content.instructorName?.charAt(0) || 'I'}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-300">{content.instructorName || 'Expert Instructor'}</span>
            </div>
            
            <div className="text-gold-400 text-sm font-semibold">
              {config.FREE_LAUNCH || !content.isPremium ? 'FREE' : 'PREMIUM'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
