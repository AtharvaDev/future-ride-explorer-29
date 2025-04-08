
import React, { useRef, useEffect } from 'react';
import { Car } from '@/data/cars';
import BookingForm from '@/components/BookingForm';
import RentalInsights from '@/components/fleet/RentalInsights';
import CarImageCarousel from '@/components/fleet/CarImageCarousel';
import BookingPageHeader from './BookingPageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { gsap } from '@/lib/gsap';
import { createRepeatingScrollAnimation } from '@/utils/scroll-animations';

interface BookingPageContainerProps {
  selectedCar: Car;
  onWatchVideo: () => void;
}

const BookingPageContainer: React.FC<BookingPageContainerProps> = ({
  selectedCar,
  onWatchVideo
}) => {
  const bookingFormRef = useRef<HTMLDivElement>(null);
  const carDetailsRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const insightsRef = useRef<HTMLDivElement>(null);

  const scrollToBookingForm = () => {
    if (bookingFormRef.current) {
      bookingFormRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  useEffect(() => {
    // Initialize animations for car details section
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }});
    
    tl.from('.page-title', {
      y: -30,
      opacity: 0,
      duration: 0.8,
      delay: 0.2
    })
    .from(carDetailsRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.6
    }, '-=0.4')
    .from(carouselRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.5
    }, '-=0.3')
    .from(insightsRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.5
    }, '-=0.3')
    .from(bookingFormRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.7
    }, '-=0.2');

    // Set up scroll animations for when elements come into view
    if (insightsRef.current && selectedCar.insights && selectedCar.insights.length > 0) {
      const insightItems = insightsRef.current.querySelectorAll('li');
      if (insightItems.length > 0) {
        gsap.set(insightItems, { opacity: 0, y: 20 });
        
        createRepeatingScrollAnimation(insightsRef.current, {
          animation: 'fadeUp',
          duration: 0.5,
          start: 'top 80%',
        });
        
        insightItems.forEach((item, index) => {
          gsap.to(item, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            delay: 1.2 + (index * 0.1),
            ease: 'power2.out'
          });
        });
      }
    }

    return () => {
      tl.kill();
    };
  }, [selectedCar.insights]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center page-title">
        Complete Your Booking
      </h1>

      {/* First Row: Car Details, Carousel, and Insights */}
      <div ref={carDetailsRef} className="mb-10">
        <Card className="overflow-hidden shadow-lg transition-all hover:shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6">
                <BookingPageHeader 
                  selectedCar={selectedCar}
                  onWatchVideo={onWatchVideo}
                  onScrollToBookingForm={scrollToBookingForm}
                />
                
                {/* Only show carousel if images are present */}
                {selectedCar.images && selectedCar.images.length > 0 && (
                  <div ref={carouselRef} className="mt-6">
                    <h3 className="text-lg font-semibold mb-4 text-primary/90">Car Gallery</h3>
                    <CarImageCarousel 
                      images={selectedCar.images} 
                      title={selectedCar.title}
                    />
                  </div>
                )}
              </div>
              
              <div className="lg:col-span-6">
                {/* Only show insights if they are present */}
                {selectedCar.insights && selectedCar.insights.length > 0 && (
                  <div ref={insightsRef} className="h-full flex items-center">
                    <RentalInsights insights={selectedCar.insights} />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row: Booking Form */}
      <div ref={bookingFormRef} id="booking-form-section" className="booking-container">
        <Card className="overflow-hidden shadow-lg border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
          <CardContent className="p-0">
            <BookingForm car={selectedCar} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingPageContainer;
