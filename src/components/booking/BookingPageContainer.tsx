
import React, { useRef } from 'react';
import { Car } from '@/data/cars';
import BookingForm from '@/components/BookingForm';
import RentalInsights from '@/components/fleet/RentalInsights';
import CarImageCarousel from '@/components/fleet/CarImageCarousel';
import BookingPageHeader from './BookingPageHeader';

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
        <div className="lg:col-span-4 car-details">
          <BookingPageHeader 
            selectedCar={selectedCar}
            onWatchVideo={onWatchVideo}
            onScrollToBookingForm={scrollToBookingForm}
          />
          
          {/* Only show carousel if images are present */}
          {selectedCar.images && selectedCar.images.length > 0 && (
            <div className="mb-6">
              <CarImageCarousel 
                images={selectedCar.images} 
                title={selectedCar.title}
              />
            </div>
          )}
          
          {/* Only show insights if they are present */}
          {selectedCar.insights && selectedCar.insights.length > 0 && (
            <RentalInsights insights={selectedCar.insights} />
          )}
        </div>

        <div ref={bookingFormRef} id="booking-form-section" className="lg:col-span-8 booking-container">
          <BookingForm car={selectedCar} />
        </div>
      </div>
    </div>
  );
};

export default BookingPageContainer;
