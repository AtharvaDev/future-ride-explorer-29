
import { useState, useRef, useEffect } from 'react';
import { Star, StarHalf, StarOff, CheckCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAllReviews } from '@/services/reviewService';
import { gsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCarousel } from "@/components/ui/carousel";
import type { Review } from "@/types/review";

const StarRating = ({ rating }: { rating: number }) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star 
          key={`full-${i}`} 
          className="text-amber-400 fill-amber-400 drop-shadow-sm transition-transform" 
        />
      );
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <StarHalf 
          key="half" 
          className="text-amber-400 fill-amber-400 drop-shadow-sm transition-transform" 
        />
      );
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarOff 
          key={`empty-${i}`} 
          className="text-gray-300 drop-shadow-sm transition-transform" 
        />
      );
    }
    
    return stars;
  };
  
  return (
    <div className="flex items-center space-x-1.5">
      {renderStars()}
    </div>
  );
};

const ReviewCard = ({ review, isActive = false }: { review: Review; isActive?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isLongReview = review.text.length > 150;
  const displayText = isLongReview ? `${review.text.substring(0, 150)}...` : review.text;
  
  return (
    <>
      <div 
        className={cn(
          "review-card bg-white/90 p-8 rounded-xl shadow transition-all duration-500",
          "hover:shadow-xl border border-gray-100 relative z-10",
          "backdrop-blur-sm min-h-[240px] flex flex-col justify-between h-full",
          isActive ? "scale-105 ring-2 ring-primary/20" : "scale-100",
          "hover:bg-gradient-to-br from-white to-blue-50/80"
        )}
      >
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-x-5 -translate-y-5 z-0"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-100/20 rounded-full translate-x-3 translate-y-3 z-0"></div>
        
        <div className="relative z-10 flex flex-col h-full">
          <StarRating rating={review.rating} />
          <p className="mt-6 text-gray-700 italic leading-relaxed flex-grow">&ldquo;{displayText}&rdquo;</p>
          
          {isLongReview && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-primary hover:text-primary/80 font-medium mt-4 self-end"
              onClick={() => setIsOpen(true)}
            >
              Read more
            </Button>
          )}
          
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center">
            <p className="font-medium text-gray-900 flex items-center gap-2">
              {review.name}
              <CheckCircle2 className="h-4 w-4 text-blue-500 fill-blue-100" />
            </p>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {review.name}
              <CheckCircle2 className="h-4 w-4 text-blue-500 fill-blue-100" />
              <div className="ml-2">
                <StarRating rating={review.rating} />
              </div>
            </DialogTitle>
            <DialogDescription className="text-right text-sm text-muted-foreground">
              Verified Customer
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <p className="text-gray-700 italic leading-relaxed py-4">
              &ldquo;{review.text}&rdquo;
            </p>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ClientReviews = () => {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: getAllReviews
  });
  
  const reviewsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    if (reviews.length === 0) return;
    
    const titleElement = titleRef.current;
    
    // Title animation
    gsap.fromTo(
      titleElement,
      { opacity: 0, y: -30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8,
        ease: "back.out(1.7)"
      }
    );
    
    // Animate review cards with stagger effect when they come into view
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const reviewCards = document.querySelectorAll('.review-card');
          gsap.fromTo(
            reviewCards,
            { opacity: 0, y: 30, scale: 0.9 },
            { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              stagger: 0.15,
              duration: 0.7,
              ease: "power3.out"
            }
          );
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    
    if (reviewsRef.current) {
      observer.observe(reviewsRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [reviews]);

  if (isLoading || reviews.length === 0) {
    return null;
  }
  
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      <div className="container mx-auto px-4 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-blue-100 rounded-full opacity-40 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-100 rounded-full opacity-40 translate-x-1/2 translate-y-1/2"></div>
        
        <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-center mb-3 text-gray-800 opacity-0">
          What Our <span className="text-primary">Clients</span> Say
        </h2>
        <p className="text-center text-gray-600 mb-16 max-w-xl mx-auto">
          Real experiences from our valued customers who have enjoyed our premium chauffeur services.
        </p>
        
        <div ref={reviewsRef} className="relative">
          <Carousel 
            opts={{ 
              align: "start",
              loop: true,
            }}
            className="w-full"
            onSelect={(api) => {
              if (api) {
                setActiveIndex(api.selectedScrollSnap());
              }
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {reviews.map((review, index) => (
                <CarouselItem 
                  key={review.id} 
                  className="pl-2 md:pl-4 sm:basis-4/5 md:basis-1/2 lg:basis-1/3 transition-opacity duration-300"
                >
                  <div className="h-full">
                    <ReviewCard review={review} isActive={activeIndex === index} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 lg:-left-12" />
            <CarouselNext className="right-0 lg:-right-12" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default ClientReviews;
