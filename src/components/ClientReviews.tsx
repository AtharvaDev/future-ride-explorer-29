
import { useEffect, useRef, useState } from 'react';
import { Star, StarHalf, StarOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAllReviews } from '@/services/reviewService';
import { gsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';

const StarRating = ({ rating }: { rating: number }) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="text-amber-400 fill-amber-400" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="text-amber-400 fill-amber-400" />);
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarOff key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return stars;
  };
  
  return (
    <div className="flex items-center space-x-1">
      {renderStars()}
    </div>
  );
};

const ClientReviews = () => {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: getAllReviews
  });
  
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Setup animations
  useEffect(() => {
    if (reviews.length === 0) return;
    
    const titleElement = titleRef.current;
    const sectionElement = sectionRef.current;
    
    if (titleElement && sectionElement) {
      // Animate the title with a split text effect
      const titleText = titleElement.innerText;
      titleElement.innerHTML = '';
      
      // Create spans for each character with staggered animation
      [...titleText].forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        titleElement.appendChild(span);
        
        gsap.to(span, {
          opacity: 1,
          y: 0,
          delay: 0.05 * index,
          duration: 0.4,
          ease: "power2.out"
        });
      });
      
      // Add parallax effect on section scroll
      gsap.fromTo(
        sectionElement.querySelector('.parallax-bg'),
        { y: 0 },
        { 
          y: -30, 
          scrollTrigger: {
            trigger: sectionElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );
    }
  }, [reviews.length]);

  if (isLoading || reviews.length === 0) {
    return null;
  }
  
  return (
    <section 
      ref={sectionRef} 
      className="py-24 relative overflow-hidden"
      style={{ 
        backgroundImage: "linear-gradient(to bottom right, #f8fafc, #e0f2fe, #f0f9ff)" 
      }}
    >
      {/* Parallax background elements */}
      <div className="absolute inset-0 parallax-bg">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-blue-200/20 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-indigo-200/20 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/2 w-40 h-40 rounded-full bg-purple-200/10 blur-2xl"></div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-amber-400 rounded-full"></div>
      <div className="absolute top-32 left-20 w-3 h-3 bg-blue-400 rounded-full"></div>
      <div className="absolute top-16 right-40 w-4 h-4 bg-purple-400 rounded-full"></div>
      <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-pink-400 rounded-full"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            What Our Clients Say
          </h2>
          <p className="text-gray-600 md:text-lg">
            Don't just take our word for it — hear genuine stories from our valued customers who have experienced our exceptional service firsthand.
          </p>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
          onSelect={(api) => {
            const currentIndex = api.selectedScrollSnap();
            setActiveIndex(currentIndex);
          }}
        >
          <CarouselContent className="py-4">
            {reviews.map((review, index) => (
              <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3">
                <div 
                  className={cn(
                    "h-full rounded-2xl p-8 transition-all duration-300 border",
                    "backdrop-blur-sm bg-white/90 hover:bg-white/95",
                    "shadow-sm hover:shadow-md",
                    "border-gray-100 dark:border-gray-800",
                    activeIndex === index ? "ring-2 ring-primary/20" : ""
                  )}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <StarRating rating={review.rating} />
                      <h3 className="mt-3 font-semibold text-lg text-gray-900">{review.name}</h3>
                    </div>
                    <span className="text-3xl leading-none text-indigo-200 font-serif">"</span>
                  </div>
                  
                  <ScrollArea className="h-[120px] pr-4 overflow-auto">
                    <p className="text-gray-600 italic leading-relaxed">
                      {review.text}
                    </p>
                  </ScrollArea>
                  
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                          {review.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-400">
                            Verified Client
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-center gap-2 mt-8">
            <CarouselPrevious className="relative inset-0 translate-y-0 hover:bg-primary hover:text-white" />
            <div className="flex gap-1">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const carousel = document.querySelector('[role="region"]');
                    if (carousel) {
                      const api = (carousel as any).__embla;
                      if (api) api.scrollTo(index);
                    }
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    activeIndex === index 
                      ? "bg-primary w-6" 
                      : "bg-gray-300 hover:bg-gray-400"
                  )}
                />
              ))}
            </div>
            <CarouselNext className="relative inset-0 translate-y-0 hover:bg-primary hover:text-white" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default ClientReviews;
