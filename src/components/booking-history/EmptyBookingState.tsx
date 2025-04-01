
import React from 'react';
import { Car } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyBookingStateProps {
  onBookCar: () => void;
  type: 'active' | 'past';
}

const EmptyBookingState: React.FC<EmptyBookingStateProps> = ({ onBookCar, type }) => {
  if (type === 'past') {
    return (
      <p className="text-center py-6 text-muted-foreground">
        You don't have any past bookings.
      </p>
    );
  }

  return (
    <div className="text-center py-10 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <Car className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
        No active bookings
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        You don't have any upcoming trips. Book a car to get started!
      </p>
      <Button onClick={onBookCar}>Book a Car Now</Button>
    </div>
  );
};

export default EmptyBookingState;
