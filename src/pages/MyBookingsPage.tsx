
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getBookingsByUserId } from '@/services/bookingService';
import { CompleteBookingData } from '@/types/booking';
import { CalendarRange, Clock, Car, MapPin, AlertTriangle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import WhatsAppButton from '@/components/WhatsAppButton';

const MyBookingsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<CompleteBookingData[]>([]);
  const [activeBookings, setActiveBookings] = useState<CompleteBookingData[]>([]);
  const [pastBookings, setPastBookings] = useState<CompleteBookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { returnUrl: '/my-bookings' } });
    }
  }, [user, authLoading, navigate]);
  
  // Fetch bookings when user is available
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        console.log("Fetching bookings for user:", user.uid);
        
        // Get all bookings for the user
        const allBookings = await getBookingsByUserId(user.uid);
        setBookings(allBookings);
        console.log("All bookings fetched:", allBookings);
        
        // Current date for comparison
        const currentDate = new Date();
        
        // Active bookings: end date is in the future or today
        const active = allBookings.filter(booking => {
          return new Date(booking.endDate) >= currentDate;
        });
        
        // Past bookings: end date is in the past
        const past = allBookings.filter(booking => {
          return new Date(booking.endDate) < currentDate;
        });
        
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
    
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleBookCar = () => {
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p>Loading your profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>Please log in to view your booking history.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => navigate('/login', { state: { returnUrl: '/my-bookings' } })}>
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const renderBookingsList = (bookingsList: CompleteBookingData[], type: 'active' | 'past') => {
    if (bookingsList.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
            <AlertTriangle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No {type === 'active' ? 'active' : 'past'} bookings found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {type === 'active' 
              ? "You don't have any upcoming or ongoing bookings." 
              : "You haven't completed any bookings yet."}
          </p>
          <Button onClick={handleBookCar}>Book a Car Now</Button>
        </div>
      );
    }

    return (
      <div className="space-y-6 p-4">
        {bookingsList.map((booking) => (
          <Card key={booking.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 p-4 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                {booking.car?.image ? (
                  <img 
                    src={booking.car.image} 
                    alt={booking.car.title || "Car"} 
                    className="h-40 object-contain" 
                  />
                ) : (
                  <div className="h-40 w-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
                    <Car className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="w-full md:w-2/3 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      {booking.car?.title || "Vehicle Booking"}
                    </h3>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Booking ID</p>
                    <p className="font-mono text-xs">{booking.id.slice(0, 8)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <CalendarRange className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Trip Dates</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {format(new Date(booking.startDate), 'MMM dd, yyyy')} - {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Pickup Location</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{booking.startCity}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 flex items-center justify-center text-gray-500">₹</div>
                    <div>
                      <p className="text-sm font-medium">Amount</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ₹{booking.paymentInfo?.totalAmount || (booking.car?.pricePerDay ? booking.car.pricePerDay * 3 : 'N/A')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-end gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {}}
                  >
                    View Details
                  </Button>
                  
                  {type === 'active' && (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => {}}
                    >
                      Manage Booking
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 mt-24">
        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">My Bookings</CardTitle>
              <CardDescription>Manage your past and upcoming bookings</CardDescription>
            </div>
            <Button onClick={handleBookCar}>Book a Car</Button>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p>Loading your bookings...</p>
                </div>
              </div>
            ) : (
              <div className="border-b">
                <div className="flex border-b">
                  <button
                    className="px-6 py-3 font-medium border-b-2 border-primary text-primary"
                    onClick={() => {}}
                  >
                    Active Bookings ({activeBookings.length})
                  </button>
                  <button
                    className="px-6 py-3 font-medium text-gray-500 hover:text-gray-900"
                    onClick={() => {}}
                  >
                    Past Bookings ({pastBookings.length})
                  </button>
                </div>
                {renderBookingsList(activeBookings, 'active')}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default MyBookingsPage;
