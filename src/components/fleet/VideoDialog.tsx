
import React, { useRef, useState } from 'react';
import { Loader, SkipForward } from 'lucide-react';
import { 
  Dialog, 
  DialogContent,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Car } from '@/data/cars';
import { UI_STRINGS } from '@/constants/uiStrings';
import { videoConfig } from '@/config/videoConfig';

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

  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLIFrameElement>(null);

  const handleSkip = () => {
    if (onVideoComplete) {
      onVideoComplete();
    }
    onOpenChange(false);
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
      <DialogContent className="sm:max-w-none max-w-none w-screen h-screen p-0 border-0 rounded-none flex items-center justify-center bg-black/95">
        <div className="relative w-full h-full flex items-center justify-center">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-4">
                <Loader className="h-12 w-12 animate-spin text-primary" />
                <p className="text-gray-100">{UI_STRINGS.VIDEO.LOADING}</p>
              </div>
            </div>
          ) : null}
          
          <div className="w-full h-full max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            <iframe
              ref={videoRef}
              className="w-full h-full border-2 border-gray-400"
              style={{ aspectRatio: '16/9', maxHeight: '90vh' }}
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0&showinfo=0`}
              title={car?.title || "Toyota Video"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              onLoad={() => setLoading(false)}
            ></iframe>
          </div>
          
          <div className="absolute bottom-8 right-8 z-20">
            <DialogClose asChild>
              <Button 
                onClick={handleSkip}
                className="bg-primary/80 hover:bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <span>{UI_STRINGS.VIDEO.SKIP_BUTTON}</span>
                <SkipForward className="h-5 w-5" />
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoDialog;
