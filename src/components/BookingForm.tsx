
import React from 'react';
import { Car } from '@/data/cars';
import BookingFormContainer from './booking/BookingFormContainer';

interface BookingFormProps {
  car: Car;
}

const BookingForm: React.FC<BookingFormProps> = ({ car }) => {
  return <BookingFormContainer car={car} />;
};

export default BookingForm;
