
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPendingBookings, acceptBooking, rejectBooking } from '@/services/booking/bookingAdminService';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatBookingDate } from '@/utils/bookingUtils';

const BookingManagementTab: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const { data: bookings = [], refetch, isLoading: isFetching } = useQuery({
    queryKey: ['pendingBookings'],
    queryFn: getPendingBookings
  });

  const onAccept = async (id: string, userId: string) => {
    try {
      setProcessingId(id);
      await acceptBooking(id, userId);
      toast.success("Booking confirmed successfully!");
      refetch();
    } catch (error) {
      console.error("Error accepting booking:", error);
      toast.error("Failed to confirm booking. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const onReject = async (id: string, userId: string) => {
    try {
      setProcessingId(id);
      await rejectBooking(id, userId);
      toast.success("Booking rejected and refund initiated.");
      refetch();
    } catch (error) {
      console.error("Error rejecting booking:", error);
      toast.error("Failed to reject booking. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };
  
  // Format date for display
  const formatDate = (dateInput: any) => {
    if (!dateInput) return 'N/A';
    return formatBookingDate(new Date(dateInput));
  };
  
  // Sort bookings by date (most recent first)
  const sortedBookings = [...bookings].sort((a, b) => {
    return new Date(b.basicInfo?.startDate).getTime() - new Date(a.basicInfo?.startDate).getTime();
  });

  if (isFetching || isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-3">Loading bookings...</span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pending Bookings</h2>
      
      {sortedBookings.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">No pending bookings found</p>
          <p className="text-sm text-gray-500">New bookings will appear here when customers make reservations</p>
        </div>
      ) : (
        <Table className="w-full table-auto bg-white shadow rounded">
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Date</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Car</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Total Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBookings.map(booking => (
              <TableRow key={booking.id} className="border-b">
                <TableCell>{formatDate(booking.basicInfo?.startDate)}</TableCell>
                <TableCell>{booking.contactInfo?.name || 'Unknown'}</TableCell>
                <TableCell>{booking.car?.title || 'Unknown'}</TableCell>
                <TableCell>{booking.basicInfo?.startCity || 'N/A'}</TableCell>
                <TableCell>{booking.basicInfo?.endCity || 'N/A'}</TableCell>
                <TableCell>₹{booking.paymentInfo?.totalAmount || 0}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    {booking.basicInfo?.status || 'pending'}
                  </span>
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    disabled={processingId === booking.id}
                    onClick={() => onAccept(booking.id, booking.userId)}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    {processingId === booking.id ? 'Processing...' : 'Accept'}
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    disabled={processingId === booking.id}
                    onClick={() => onReject(booking.id, booking.userId)}
                  >
                    {processingId === booking.id ? 'Processing...' : 'Reject'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default BookingManagementTab;
