
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
  const itemsRef = useRef<HTMLDivElement[]>([]);
  
  // Filter out any undefined or empty strings
  const validImages = images?.filter(img => img && img.trim() !== '') || [];
  
  // Reset the itemsRef array when the images change
  itemsRef.current = [];
  
  useEffect(() => {
    if (carouselRef.current) {
      // Entrance animation for the carousel
      gsap.from(carouselRef.current, {
        opacity: 0,
        y: 15,
        duration: 0.6,
        delay: 0.2,
        ease: "power2.out"
      });
      
      // Staggered animation for carousel items
      if (itemsRef.current.length > 0) {
        gsap.from(itemsRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.4,
          ease: "back.out(1.7)"
        });
      }
      
      // Add shine effect to carousel navigation buttons
      const navButtons = carouselRef.current.querySelectorAll('button');
      navButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            backgroundColor: 'rgba(var(--primary), 0.2)',
            scale: 1.1,
            duration: 0.3,
            ease: "power1.out"
          });
        });
        
        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            backgroundColor: 'rgba(var(--background), 0.8)',
            scale: 1,
            duration: 0.3,
            ease: "power1.out"
          });
        });
      });
      
      return () => {
        // Clean up animations
        gsap.killTweensOf(carouselRef.current);
        if (itemsRef.current.length > 0) {
          gsap.killTweensOf(itemsRef.current);
        }
        navButtons.forEach(button => {
          gsap.killTweensOf(button);
        });
      };
    }
  }, [validImages]);
  
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
              ref={(el) => el && itemsRef.current.push(el)}
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
                      ref={(el) => el && itemsRef.current.push(el)}
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
        <CarouselPrevious className="left-2 transition-transform duration-300" />
        <CarouselNext className="right-2 transition-transform duration-300" />
      </Carousel>
    </div>
  );
};

export default CarImageCarousel;
