
import React, { useRef } from 'react';
import { Car } from '@/data/cars';
import BookingForm from '@/components/BookingForm';
import RentalInsights from '@/components/fleet/RentalInsights';
import CarImageCarousel from '@/components/fleet/CarImageCarousel';
import BookingPageHeader from './BookingPageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface BookingPageContainerProps {
  selectedCar: Car;
  onWatchVideo: () => void;
}

const BookingPageContainer: React.FC<BookingPageContainerProps> = ({
  selectedCar,
  onWatchVideo
}) => {
  console.log("BookingPageContainer rendering with car:", selectedCar?.id);
  
  const bookingFormRef = useRef<HTMLDivElement>(null);
  const carDetailsRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const insightsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if selectedCar is valid
  if (!selectedCar) {
    console.error("BookingPageContainer: selectedCar is null or undefined");
    toast.error("Error loading car details");
    return null;
  }

  const scrollToBookingForm = () => {
    if (bookingFormRef.current) {
      bookingFormRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12" ref={containerRef}>
      {/* First Row: Car Details, Carousel, and Insights */}
      <div ref={carDetailsRef} className="mb-10">
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm relative">
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
