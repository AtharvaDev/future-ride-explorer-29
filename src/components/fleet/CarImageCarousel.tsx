
import React, { useRef, useEffect } from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card, CardContent } from '@/components/ui/card';
import { Image } from 'lucide-react';
import { gsap } from '@/lib/gsap';

interface CarImageCarouselProps {
  images: string[];
  title: string;
}

const CarImageCarousel: React.FC<CarImageCarouselProps> = ({ images, title }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Filter out any undefined or empty strings
  const validImages = images?.filter(img => img && img.trim() !== '') || [];
  
  useEffect(() => {
    if (carouselRef.current) {
      gsap.from(carouselRef.current, {
        opacity: 0,
        y: 15,
        duration: 0.6,
        delay: 0.2,
        ease: 'power2.out'
      });
    }
  }, []);
  
  if (!validImages || validImages.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <Image className="h-10 w-10" />
          <p>No images available</p>
        </div>
      </div>
    );
  }

  // If there's only one image, just show it without carousel controls
  if (validImages.length === 1) {
    return (
      <div className="w-full" ref={carouselRef}>
        <Card className="overflow-hidden border-0 shadow-md">
          <CardContent className="flex aspect-[16/9] items-center justify-center p-2 relative overflow-hidden">
            <img 
              src={validImages[0]} 
              alt={`${title}`}
              className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div ref={carouselRef}>
      <Carousel className="w-full">
        <CarouselContent>
          {validImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className="overflow-hidden border-0 shadow-md">
                  <CardContent className="flex aspect-[16/9] items-center justify-center p-2 relative overflow-hidden">
                    <img 
                      src={image} 
                      alt={`${title} - Image ${index + 1}`}
                      className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute bottom-3 right-3 bg-primary/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                      {index + 1}/{validImages.length}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
};

export default CarImageCarousel;
