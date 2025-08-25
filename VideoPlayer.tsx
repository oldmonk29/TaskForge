import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Maximize, Settings, Bookmark, Share2, ThumbsUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { AdSlot } from './AdSlot';
import { apiRequest } from '@/lib/queryClient';
import type { Content } from '@shared/schema';

interface VideoPlayerProps {
  content: Content;
}

export function VideoPlayer({ content }: VideoPlayerProps) {
  const { appUser } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Update watch history periodically
    const interval = setInterval(() => {
      if (appUser && videoRef.current && !videoRef.current.paused) {
        updateWatchHistory(Math.floor(videoRef.current.currentTime));
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [appUser, content.id]);

  const updateWatchHistory = async (positionSeconds: number) => {
    if (!appUser) return;
    
    try {
      await apiRequest('POST', '/api/watch-history', {
        userId: appUser.id,
        contentId: content.id,
        positionSeconds
      });
    } catch (error) {
      console.error('Failed to update watch history:', error);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Video Player Column */}
        <div className="lg:col-span-2">
          {/* Video Player */}
          <div className="relative bg-black rounded-xl overflow-hidden mb-6" data-testid="video-player">
            <video
              ref={videoRef}
              className="w-full aspect-video"
              src={content.videoUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            
            {/* User Watermark (Anti-piracy) */}
            {appUser && (
              <div className="absolute top-4 right-4 bg-black/60 px-2 py-1 rounded text-sm" data-testid="user-watermark">
                {appUser.email}
              </div>
            )}

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  data-testid="video-progress"
                />
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlay}
                    className="text-white hover:text-gold-400"
                    data-testid="play-pause-button"
                  >
                    {isPlaying ? <Pause /> : <Play />}
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <Volume2 className="text-white w-4 h-4" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(parseInt(e.target.value))}
                      className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      data-testid="volume-slider"
                    />
                  </div>
                  
                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Settings className="text-white w-5 h-5 cursor-pointer hover:text-gold-400" />
                  <Maximize className="text-white w-5 h-5 cursor-pointer hover:text-gold-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Video Details */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-3">{content.title}</h1>
            <div className="flex items-center space-x-4 text-gray-400 text-sm mb-4">
              <span>{content.viewCount?.toLocaleString() || 0} views</span>
              <span>•</span>
              <span>{content.duration ? `${Math.floor(content.duration / 3600)}h ${Math.floor((content.duration % 3600) / 60)}m duration` : ''}</span>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-4 mb-6">
              <Button variant="outline" size="sm" data-testid="like-button">
                <ThumbsUp className="w-4 h-4 mr-2" />
                Like
              </Button>
              <Button variant="outline" size="sm" data-testid="share-button">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" data-testid="save-button">
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button className="bg-gold-400 text-black hover:bg-gold-300" size="sm" data-testid="get-certificate-button">
                <Award className="w-4 h-4 mr-2" />
                Get Certificate
              </Button>
            </div>

            {/* Description */}
            <div className="bg-dark-700 rounded-xl p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={content.instructorImage || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64`} />
                  <AvatarFallback>{content.instructorName?.charAt(0) || 'I'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{content.instructorName || 'Expert Instructor'}</h3>
                  <p className="text-gray-400 text-sm">Senior Cybersecurity Consultant</p>
                  <p className="text-gold-400 text-sm font-semibold">142K subscribers</p>
                </div>
                <Button className="bg-gold-400 text-black hover:bg-gold-300" data-testid="subscribe-button">
                  Subscribe
                </Button>
              </div>
              
              <div className="text-gray-300">
                <p className="mb-4">{content.description}</p>
              </div>
            </div>

            {/* Ad Placement Under Description */}
            <AdSlot placement="below_description" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Course Progress */}
          <div className="bg-dark-700 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4">Course Progress</h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Completed</span>
                <span className="text-gold-400 font-semibold">{Math.floor(progress)}%</span>
              </div>
              <div className="bg-dark-600 h-2 rounded-full">
                <div 
                  className="bg-gradient-to-r from-gold-600 to-gold-400 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
