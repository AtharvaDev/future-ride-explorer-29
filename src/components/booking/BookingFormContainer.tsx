
import React, { useEffect } from 'react';
import { Car } from '@/data/cars';
import BookingStepsController from './steps/BookingStepsController';

interface BookingFormContainerProps {
  car: Car;
}

const BookingFormContainer: React.FC<BookingFormContainerProps> = ({ car }) => {
  useEffect(() => {
    console.log("BookingFormContainer rendering with car:", car?.id);
  }, [car]);

  return (
    <div className="booking-form-container py-4">
      <BookingStepsController car={car} />
    </div>
  );
};

export default BookingFormContainer;
