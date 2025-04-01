
import React from 'react';
import { BookingStatus } from '@/types/booking';

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ status }) => {
  const statusStyles = {
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
    draft: 'bg-yellow-100 text-yellow-800',
  };

  const style = statusStyles[status] || 'bg-gray-100 text-gray-800';
  const displayText = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${style}`}>
      {displayText}
    </span>
  );
};

export default BookingStatusBadge;
