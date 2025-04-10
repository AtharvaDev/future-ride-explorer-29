
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

  if (!car) {
    console.error("BookingFormContainer received null or undefined car");
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
        <p className="text-red-500">Error: Car data is missing</p>
      </div>
    );
  }

  return (
    <div className="booking-form-container py-4">
      <BookingStepsController car={car} />
    </div>
  );
};

export default BookingFormContainer;
