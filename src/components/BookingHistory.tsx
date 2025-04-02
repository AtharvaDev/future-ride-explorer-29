
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getActiveBookingsByUserId, getPastBookingsByUserId } from '@/services/bookingService';
import { CompleteBookingData } from '@/types/booking';
import BookingHistoryTabs from './booking-history/BookingHistoryTabs';

const BookingHistory: React.FC = () => {
  const { user } = useAuth();
  const [activeBookings, setActiveBookings] = useState<CompleteBookingData[]>([]);
  const [pastBookings, setPastBookings] = useState<CompleteBookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        console.log("Fetching bookings for user:", user.uid);
        
        // Get active and past bookings using the dedicated functions
        const active = await getActiveBookingsByUserId(user.uid);
        const past = await getPastBookingsByUserId(user.uid);
        
        console.log("Active bookings:", active);
        console.log("Past bookings:", past);
        
        setActiveBookings(active);
        setPastBookings(past);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [user]);

  const handleBookCar = () => {
    navigate('/');
  };

  if (!user) {
    return (
      <Card className="my-8">
        <CardHeader>
          <CardTitle>Booking History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please log in to view your booking history.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="my-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Bookings</CardTitle>
          <Button onClick={handleBookCar}>Book a Car</Button>
        </CardHeader>
        <CardContent>
          <BookingHistoryTabs 
            activeBookings={activeBookings}
            pastBookings={pastBookings}
            loading={loading}
            onBookCar={handleBookCar}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingHistory;
