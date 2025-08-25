import { useState, useRef } from 'react';
import { Card } from './Card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { Content } from '@shared/schema';

interface CarouselProps {
  title: string;
  content: Content[];
  onViewAll?: () => void;
}

export function Carousel({ title, content, onViewAll }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Width of card + gap
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-16 animate-slide-up">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-playfair font-bold text-gold-400">{title}</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scroll('left')}
            className="text-gray-400 hover:text-gold-400"
            data-testid={`carousel-${title}-scroll-left`}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scroll('right')}
            className="text-gray-400 hover:text-gold-400"
            data-testid={`carousel-${title}-scroll-right`}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
          {onViewAll && (
            <Button
              variant="ghost"
              onClick={onViewAll}
              className="text-gold-400 hover:text-gold-300 font-semibold"
              data-testid={`carousel-${title}-view-all`}
            >
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        data-testid={`carousel-${title}-content`}
      >
        {content.map((item) => (
          <Card key={item.id} content={item} />
        ))}
      </div>
    </div>
  );
}
