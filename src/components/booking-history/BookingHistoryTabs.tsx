
import React from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList,
  TabsTrigger 
} from '@/components/ui/tabs';
import { CompleteBookingData } from '@/types/booking';
import BookingTable from './BookingTable';

interface BookingHistoryTabsProps {
  activeBookings: CompleteBookingData[];
  pastBookings: CompleteBookingData[];
  loading: boolean;
  onBookCar: () => void;
}

const BookingHistoryTabs: React.FC<BookingHistoryTabsProps> = ({ 
  activeBookings, 
  pastBookings, 
  loading, 
  onBookCar 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="active">
      <TabsList className="mb-6 w-full grid grid-cols-2">
        <TabsTrigger value="active">
          Active Bookings ({activeBookings.length})
        </TabsTrigger>
        <TabsTrigger value="past">
          Past Bookings ({pastBookings.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="active">
        <BookingTable 
          bookings={activeBookings} 
          type="active" 
          onBookCar={onBookCar} 
        />
      </TabsContent>
      
      <TabsContent value="past">
        <BookingTable 
          bookings={pastBookings} 
          type="past" 
          onBookCar={onBookCar} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default BookingHistoryTabs;
