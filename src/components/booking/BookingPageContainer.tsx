
import React, { useRef } from 'react';
import { Car } from '@/data/cars';
import BookingForm from '@/components/BookingForm';
import RentalInsights from '@/components/fleet/RentalInsights';
import CarImageCarousel from '@/components/fleet/CarImageCarousel';
import BookingPageHeader from './BookingPageHeader';
import { Card, CardContent } from '@/components/ui/card';

interface BookingPageContainerProps {
  selectedCar: Car;
  onWatchVideo: () => void;
}

const BookingPageContainer: React.FC<BookingPageContainerProps> = ({
  selectedCar,
  onWatchVideo
}) => {
  const bookingFormRef = useRef<HTMLDivElement>(null);

  const scrollToBookingForm = () => {
    if (bookingFormRef.current) {
      bookingFormRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-10 text-center page-title">
        Complete Your Booking
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 car-details">
          <Card className="h-full overflow-hidden shadow-lg transition-all hover:shadow-xl border-0">
            <CardContent className="p-6">
              <BookingPageHeader 
                selectedCar={selectedCar}
                onWatchVideo={onWatchVideo}
                onScrollToBookingForm={scrollToBookingForm}
              />
              
              {/* Only show carousel if images are present */}
              {selectedCar.images && selectedCar.images.length > 0 && (
                <div className="mb-6 mt-6">
                  <CarImageCarousel 
                    images={selectedCar.images} 
                    title={selectedCar.title}
                  />
                </div>
              )}
              
              {/* Only show insights if they are present */}
              {selectedCar.insights && selectedCar.insights.length > 0 && (
                <div className="mt-6">
                  <RentalInsights insights={selectedCar.insights} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div ref={bookingFormRef} id="booking-form-section" className="lg:col-span-7 booking-container">
          <Card className="h-full overflow-hidden shadow-lg border-0">
            <CardContent className="p-0">
              <BookingForm car={selectedCar} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingPageContainer;
