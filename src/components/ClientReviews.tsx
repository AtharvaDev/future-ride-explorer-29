
import { useEffect, useRef } from 'react';
import { Star, StarHalf, StarOff } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAllReviews } from '@/services/reviewService';
import { gsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';

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
  
  const reviewsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    if (reviews.length === 0) return;
    
    const reviewsContainer = reviewsRef.current;
    const reviewElements = reviewsContainer?.querySelectorAll('.review-card');
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
    
    // Setup animations for each review card
    if (reviewElements) {
      gsap.set(reviewElements, { opacity: 0, y: 50 });
      
      // Create the scroll trigger
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const card = entry.target;
              const index = Array.from(reviewElements).indexOf(card);
              
              gsap.to(card, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: index * 0.15,
                ease: "power3.out",
              });
            }
          });
        },
        { threshold: 0.1 }
      );
      
      reviewElements.forEach((card) => {
        observer.observe(card);
      });
      
      return () => {
        if (reviewElements) {
          reviewElements.forEach((card) => {
            observer.unobserve(card);
          });
        }
      };
    }
  }, [reviews]);

  if (isLoading || reviews.length === 0) {
    return null;
  }
  
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-blue-100 rounded-full opacity-40 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-100 rounded-full opacity-40 translate-x-1/2 translate-y-1/2"></div>
        
        <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-center mb-3 text-gray-800 opacity-0">
          Client <span className="text-primary">Testimonials</span>
        </h2>
        <p className="text-center text-gray-600 mb-16 max-w-xl mx-auto">
          Don't just take our word for it — see what our clients have to say about their experience with us.
        </p>
        
        <div ref={reviewsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div 
              key={review.id} 
              className={cn(
                "review-card bg-white p-8 rounded-xl shadow-lg",
                "hover:shadow-xl transition-all duration-300",
                "border border-gray-100 relative z-10",
                "backdrop-blur-sm bg-white/90"
              )}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-x-5 -translate-y-5 z-0"></div>
              
              <div className="relative z-10">
                <StarRating rating={review.rating} />
                <p className="mt-6 text-gray-700 italic leading-relaxed">"{review.text}"</p>
                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-primary flex items-center justify-center text-white font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <p className="ml-3 font-medium text-gray-900">{review.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientReviews;
