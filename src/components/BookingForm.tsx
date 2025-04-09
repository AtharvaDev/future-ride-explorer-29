
import React from 'react';
import { Car } from '@/data/cars';
import BookingFormContainer from './booking/BookingFormContainer';

interface BookingFormProps {
  car: Car;
}

const BookingForm: React.FC<BookingFormProps> = ({ car }) => {
  console.log("BookingForm rendering with car:", car?.id);
  
  if (!car) {
    console.error("BookingForm received null or undefined car");
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error: Car data is missing</p>
      </div>
    );
  }
  
  return <BookingFormContainer car={car} />;
};

export default BookingForm;
