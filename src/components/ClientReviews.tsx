
import { useEffect } from 'react';
import { Star, StarHalf, StarOff } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAllReviews } from '@/services/reviewService';

const StarRating = ({ rating }: { rating: number }) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="text-primary fill-primary" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="text-primary fill-primary" />);
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarOff key={`empty-${i}`} className="text-muted-foreground" />);
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
  
  useEffect(() => {
    // Initialize animations for this section
    const revealReviews = () => {
      const reviewElements = document.querySelectorAll('.review-card');
      reviewElements.forEach((el, i) => {
        const delay = i * 0.2;
        el.classList.add('revealed');
        (el as HTMLElement).style.transitionDelay = `${delay}s`;
      });
    };
    
    // Use IntersectionObserver to trigger animations when section is in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealReviews();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const section = document.querySelector('.client-reviews-section');
    if (section) {
      observer.observe(section);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [reviews]);
  
  if (isLoading || reviews.length === 0) {
    return null;
  }
  
  return (
    <section className="client-reviews-section py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Clients Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="review-card bg-white p-6 rounded-lg shadow-md transform transition-all duration-500 opacity-0 translate-y-8 hover:shadow-lg"
            >
              <StarRating rating={review.rating} />
              <p className="mt-4 text-gray-700 italic">{review.text}</p>
              <p className="mt-4 font-semibold">- {review.name}</p>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .review-card.revealed {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </section>
  );
};

export default ClientReviews;
