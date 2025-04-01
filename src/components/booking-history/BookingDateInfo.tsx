
import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';

interface BookingDateInfoProps {
  startDate: Date;
  endDate: Date;
}

const BookingDateInfo: React.FC<BookingDateInfoProps> = ({ startDate, endDate }) => {
  // Ensure dates are Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Calculate duration in days
  const durationInDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <>
      <div className="flex items-center">
        <Calendar className="w-4 h-4 mr-1 text-primary" />
        <span>{format(start, 'MMM dd, yyyy')}</span>
      </div>
      <div className="flex items-center mt-1 text-muted-foreground text-sm">
        <Clock className="w-3 h-3 mr-1" />
        <span>For {durationInDays} days</span>
      </div>
    </>
  );
};

export default BookingDateInfo;
