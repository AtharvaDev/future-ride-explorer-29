
import React, { useRef, useEffect } from 'react';
import { Car } from '@/data/cars';
import BookingForm from '@/components/BookingForm';
import RentalInsights from '@/components/fleet/RentalInsights';
import CarImageCarousel from '@/components/fleet/CarImageCarousel';
import BookingPageHeader from './BookingPageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { gsap } from '@/lib/gsap';
import { ScrollTrigger } from '@/lib/gsap';
import { createRepeatingScrollAnimation } from '@/utils/scroll-animations';
import { staggerElements } from '@/utils/animations';

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
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBookingForm = () => {
    if (bookingFormRef.current) {
      gsap.to(window, {
        duration: 1,
        scrollTo: {
          y: bookingFormRef.current,
          offsetY: 80
        },
        ease: "power2.inOut"
      });
    }
  };

  useEffect(() => {
    // Main container animation setup
    if (containerRef.current) {
      gsap.set(containerRef.current, { opacity: 0 });
      gsap.to(containerRef.current, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      });
    }

    // First row animations
    const detailsCard = carDetailsRef.current;
    if (detailsCard) {
      // Create a shine effect on card hover
      const shineEffect = gsap.to(detailsCard.querySelector('.card-shine'), {
        x: "150%",
        duration: 1.5,
        paused: true,
        ease: "power2.inOut"
      });

      detailsCard.addEventListener("mouseenter", () => {
        gsap.set(detailsCard.querySelector('.card-shine'), { x: "-150%" });
        shineEffect.restart();
      });

      // Create subtle float animation for the card
      gsap.to(detailsCard, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }

    // Booking form animations
    if (bookingFormRef.current) {
      ScrollTrigger.create({
        trigger: bookingFormRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(bookingFormRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
          );
        },
        once: true
      });
    }

    // Clean up animations on component unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (containerRef.current) {
        gsap.killTweensOf(containerRef.current);
      }
      if (carDetailsRef.current) {
        gsap.killTweensOf(carDetailsRef.current);
      }
      if (bookingFormRef.current) {
        gsap.killTweensOf(bookingFormRef.current);
      }
    };
  }, [selectedCar]);

  // Set up insights animation when they exist
  useEffect(() => {
    if (insightsRef.current && selectedCar.insights && selectedCar.insights.length > 0) {
      const insightItems = insightsRef.current.querySelectorAll('li');
      if (insightItems.length > 0) {
        staggerElements(Array.from(insightItems), 0.1, 'fadeInRight');
        
        // Create scroll-triggered re-animation
        ScrollTrigger.create({
          trigger: insightsRef.current,
          start: "top 75%",
          onLeaveBack: () => {
            gsap.set(insightItems, { opacity: 0, x: 30 });
            staggerElements(Array.from(insightItems), 0.1, 'fadeInRight');
          },
          onEnter: () => {
            gsap.set(insightItems, { opacity: 0, x: 30 });
            staggerElements(Array.from(insightItems), 0.1, 'fadeInRight');
          }
        });
      }
    }
  }, [selectedCar.insights]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12" ref={containerRef}>
      {/* First Row: Car Details, Carousel, and Insights */}
      <div ref={carDetailsRef} className="mb-10 animate-on-scroll">
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm relative">
          {/* Shine effect overlay */}
          <div className="card-shine absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-20 transform pointer-events-none"></div>
          
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
      <div ref={bookingFormRef} id="booking-form-section" className="booking-container animate-on-scroll">
        <Card className="overflow-hidden shadow-lg transition-all duration-500 hover:shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
          <CardContent className="p-0">
            <BookingForm car={selectedCar} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingPageContainer;
