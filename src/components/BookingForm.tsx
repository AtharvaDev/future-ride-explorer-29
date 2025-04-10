
import React from 'react';
import { Car } from '@/data/cars';
import BookingFormContainer from './booking/BookingFormContainer';
import { toast } from 'sonner';

interface BookingFormProps {
  car: Car;
}

const BookingForm: React.FC<BookingFormProps> = ({ car }) => {
  console.log("BookingForm rendering with car:", car?.id);
  
  if (!car) {
    console.error("BookingForm received null or undefined car");
    toast.error("Could not load car details. Please try again.");
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
        <p className="text-red-500">Error: Car data is missing</p>
      </div>
    );
  }
  
  return <BookingFormContainer car={car} />;
};

export default BookingForm;
