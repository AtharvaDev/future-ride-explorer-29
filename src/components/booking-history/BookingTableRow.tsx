
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { CompleteBookingData } from '@/types/booking';
import BookingStatusBadge from './BookingStatusBadge';
import BookingDateInfo from './BookingDateInfo';

interface BookingTableRowProps {
  booking: CompleteBookingData;
}

const BookingTableRow: React.FC<BookingTableRowProps> = ({ booking }) => {
  return (
    <TableRow key={booking.id}>
      <TableCell className="font-medium">
        {booking.car ? booking.car.title : booking.carId}
      </TableCell>
      <TableCell>
        <BookingDateInfo startDate={booking.startDate} endDate={booking.endDate} />
      </TableCell>
      <TableCell>{booking.startCity}</TableCell>
      <TableCell>
        <BookingStatusBadge status={booking.status} />
      </TableCell>
      <TableCell>
        {booking.paymentInfo ? (
          <div>
            <div>₹{booking.paymentInfo.totalAmount}</div>
            {booking.status !== 'completed' && (
              <div className="text-xs text-muted-foreground">
                (₹{booking.paymentInfo.tokenAmount} paid)
              </div>
            )}
          </div>
        ) : (
          '-'
        )}
      </TableCell>
    </TableRow>
  );
};

export default BookingTableRow;
