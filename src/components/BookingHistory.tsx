
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
import { CompleteBookingData, getActiveBookingsByUserId, getPastBookingsByUserId } from '@/services/bookingService';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Calendar, Car, Clock } from 'lucide-react';

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
                  <div className="text-center py-10 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Car className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                      No active bookings
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      You don't have any upcoming trips. Book a car to get started!
                    </p>
                    <Button onClick={handleBookCar}>Book a Car Now</Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Car</TableHead>
                          <TableHead>Trip Dates</TableHead>
                          <TableHead>Starting City</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">
                              {booking.car ? booking.car.title : booking.carId}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1 text-primary" />
                                <span>{format(booking.startDate, 'MMM dd, yyyy')}</span>
                              </div>
                              <div className="flex items-center mt-1 text-muted-foreground text-sm">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>For {Math.ceil((booking.endDate.getTime() - booking.startDate.getTime()) / (1000 * 60 * 60 * 24))} days</span>
                              </div>
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
                            <TableCell>
                              {booking.paymentInfo ? (
                                <div>
                                  <div>₹{booking.paymentInfo.totalAmount}</div>
                                  <div className="text-xs text-muted-foreground">
                                    (₹{booking.paymentInfo.tokenAmount} paid)
                                  </div>
                                </div>
                              ) : (
                                '-'
                              )}
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
                          <TableHead>Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pastBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">
                              {booking.car ? booking.car.title : booking.carId}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1 text-primary" />
                                <span>{format(booking.startDate, 'MMM dd, yyyy')}</span>
                              </div>
                              <div className="flex items-center mt-1 text-muted-foreground text-sm">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>For {Math.ceil((booking.endDate.getTime() - booking.startDate.getTime()) / (1000 * 60 * 60 * 24))} days</span>
                              </div>
                            </TableCell>
                            <TableCell>{booking.startCity}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                booking.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : booking.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : booking.status === 'completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell>
                              {booking.paymentInfo ? (
                                <div>
                                  <div>₹{booking.paymentInfo.totalAmount}</div>
                                </div>
                              ) : (
                                '-'
                              )}
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
