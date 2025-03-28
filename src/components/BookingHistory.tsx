
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { 
  Tabs, 
  TabsContent, 
  TabsList,
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CompleteBookingData, getActiveBookingsByUserId, getPastBookingsByUserId } from '@/services/bookingService';

const BookingHistory: React.FC = () => {
  const { user } = useAuth();
  const [activeBookings, setActiveBookings] = useState<CompleteBookingData[]>([]);
  const [pastBookings, setPastBookings] = useState<CompleteBookingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const active = await getActiveBookingsByUserId(user.uid);
        const past = await getPastBookingsByUserId(user.uid);
        
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
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
          ) : (
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
                {activeBookings.length === 0 ? (
                  <p className="text-center py-6 text-muted-foreground">
                    You don't have any active bookings.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Car</TableHead>
                          <TableHead>Trip Dates</TableHead>
                          <TableHead>Starting City</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.carId}</TableCell>
                            <TableCell>
                              {format(booking.startDate, 'MMM dd, yyyy')} - {format(booking.endDate, 'MMM dd, yyyy')}
                            </TableCell>
                            <TableCell>{booking.startCity}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                booking.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past">
                {pastBookings.length === 0 ? (
                  <p className="text-center py-6 text-muted-foreground">
                    You don't have any past bookings.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Car</TableHead>
                          <TableHead>Trip Dates</TableHead>
                          <TableHead>Starting City</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pastBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.carId}</TableCell>
                            <TableCell>
                              {format(booking.startDate, 'MMM dd, yyyy')} - {format(booking.endDate, 'MMM dd, yyyy')}
                            </TableCell>
                            <TableCell>{booking.startCity}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                booking.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : booking.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingHistory;
