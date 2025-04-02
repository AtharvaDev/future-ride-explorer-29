
import React from 'react';
import { Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UI_STRINGS } from '@/constants/uiStrings';

interface EmptyBookingStateProps {
  onBookCar: () => void;
  type: 'active' | 'past';
}

const EmptyBookingState: React.FC<EmptyBookingStateProps> = ({ onBookCar, type }) => {
  if (type === 'past') {
    return (
      <p className="text-center py-6 text-muted-foreground">
        {UI_STRINGS.BOOKING_HISTORY.NO_PAST_BOOKINGS}
      </p>
    );
  }

  return (
    <div className="text-center py-10 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <Car className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
        {UI_STRINGS.BOOKING_HISTORY.NO_ACTIVE_BOOKINGS}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        {UI_STRINGS.BOOKING_HISTORY.NO_ACTIVE_DESCRIPTION}
      </p>
      <Button onClick={onBookCar}>{UI_STRINGS.BOOKING.BUTTONS.BOOK_A_CAR_NOW}</Button>
    </div>
  );
};

export default EmptyBookingState;
