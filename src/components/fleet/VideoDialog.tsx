
import React, { useRef, useState, useEffect } from 'react';
import { Loader, SkipForward } from 'lucide-react';
import { 
  Dialog, 
  DialogContent
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Car } from '@/data/cars';
import { appConfig } from '@/config/appConfig';
import { uiStrings } from '@/constants/uiStrings';

interface VideoDialogProps {
  car: Car | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVideoComplete?: () => void;
}

const VideoDialog: React.FC<VideoDialogProps> = ({ 
  car, 
  open, 
  onOpenChange,
  onVideoComplete 
}) => {
  // Early returns before any hooks
  if (!car?.video) return null;
  
  // Extract YouTube video ID safely
  const getYouTubeVideoId = (url: string): string | null => {
    try {
      // Handle different YouTube URL formats
      if (url.includes('v=')) {
        return url.split('v=')[1]?.split('&')[0] || null;
      } else if (url.includes('youtu.be/')) {
        return url.split('youtu.be/')[1]?.split('?')[0] || null;
      }
      return null;
    } catch (error) {
      console.error("Error extracting YouTube video ID:", error);
      return null;
    }
  };

  const videoId = getYouTubeVideoId(car.video);
  
  if (!videoId) return null;
  
  // All hooks after all early returns
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Setup timer for video completion
  useEffect(() => {
    if (open && onVideoComplete) {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Set new timer for video duration from config
      timerRef.current = setTimeout(() => {
        onOpenChange(false);
        if (onVideoComplete) onVideoComplete();
      }, appConfig.video.redirectDuration);
    }
    
    // Cleanup timer on unmount or dialog close
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [open, onVideoComplete, onOpenChange]);

  const handleSkip = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    onOpenChange(false);
    if (onVideoComplete) onVideoComplete();
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open && onVideoComplete) {
          onVideoComplete();
        }
      }}
    >
      <DialogContent 
        className="sm:max-w-none max-w-none w-full h-full p-0 border-0 rounded-none fixed inset-0 bg-black m-0"
        style={{ width: '100vw', height: '100vh' }}
      >
        <div 
          ref={containerRef}
          className="w-full h-full bg-black relative flex items-center justify-center"
        >
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-4">
                <Loader className="h-12 w-12 animate-spin text-primary" />
                <p className="text-gray-100">{uiStrings.video.loading}</p>
              </div>
            </div>
          ) : null}
          
          <iframe
            ref={videoRef}
            className="w-full h-full absolute inset-0"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=${appConfig.video.autoplay ? 1 : 0}&mute=0&controls=${appConfig.video.showControls ? 1 : 0}&showinfo=0&rel=0`}
            title={car?.title || uiStrings.video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            onLoad={() => setLoading(false)}
          ></iframe>

          {/* Skip button */}
          <div className="absolute bottom-8 right-8 z-20">
            <Button 
              onClick={handleSkip}
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white"
            >
              <SkipForward className="mr-2 h-4 w-4" />
              {uiStrings.video.skipButton}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoDialog;
