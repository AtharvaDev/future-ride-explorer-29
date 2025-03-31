
import React, { useRef, useState, useEffect } from 'react';
import { Loader, Maximize2, Minimize2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Car } from '@/data/cars';
import { Button } from '@/components/ui/button';

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
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // If car or video URL isn't provided, don't render the dialog
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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open && onVideoComplete) {
          onVideoComplete();
        }
        if (!open) {
          setIsFullscreen(false);
        }
      }}
    >
      <DialogContent 
        className={isFullscreen 
          ? "sm:max-w-none max-w-none w-screen h-screen p-0 border-0 rounded-none fixed inset-0 z-50" 
          : "sm:max-w-4xl"}
      >
        {!isFullscreen && (
          <DialogHeader>
            <DialogTitle>{car?.title}</DialogTitle>
          </DialogHeader>
        )}
        <div 
          ref={containerRef}
          className={isFullscreen 
            ? "w-full h-full bg-black relative" 
            : "w-full h-[60vh] bg-black relative rounded-md overflow-hidden"}
        >
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Loader className="h-12 w-12 animate-spin text-primary" />
                <p className="text-gray-100">Loading video...</p>
              </div>
            </div>
          ) : null}
          
          <iframe
            ref={videoRef}
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&showinfo=0&rel=0`}
            title={car?.title || "Toyota Video"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            onLoad={() => setLoading(false)}
          ></iframe>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 bg-black/60 text-white border-white/30 hover:bg-black/80 z-10"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoDialog;
