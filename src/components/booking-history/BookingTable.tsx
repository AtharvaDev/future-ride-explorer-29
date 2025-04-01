
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CompleteBookingData } from '@/types/booking';
import BookingTableRow from './BookingTableRow';
import EmptyBookingState from './EmptyBookingState';

interface BookingTableProps {
  bookings: CompleteBookingData[];
  type: 'active' | 'past';
  onBookCar: () => void;
}

const BookingTable: React.FC<BookingTableProps> = ({ bookings, type, onBookCar }) => {
  if (bookings.length === 0) {
    return <EmptyBookingState type={type} onBookCar={onBookCar} />;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Car</TableHead>
            <TableHead>Trip Dates</TableHead>
            <TableHead>Starting City</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>{type === 'active' ? 'Price' : 'Amount'}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <BookingTableRow key={booking.id} booking={booking} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookingTable;
