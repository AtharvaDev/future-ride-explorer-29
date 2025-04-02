
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CheckCircle, Phone, Calendar, Home } from 'lucide-react';
import { format } from 'date-fns';
import { BookingNotificationDetails } from '@/types/notifications';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BookingSuccessProps {
  bookingDetails: BookingNotificationDetails;
  onViewBookings: () => void;
}

const BookingSuccess: React.FC<BookingSuccessProps> = ({ 
  bookingDetails, 
  onViewBookings 
}) => {
  const navigate = useNavigate();
  
  // Auto-navigate to bookings page after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      // Auto-navigate can be disabled if desired
      // onViewBookings();
    }, 10000); // 10 seconds
    
    return () => clearTimeout(timer);
  }, [onViewBookings]);
  
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <ScrollArea className="h-[70vh] w-full">
      <div className="flex flex-col items-center p-4">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
            <CheckCircle className="w-14 h-14 text-green-600 dark:text-green-400" />
          </div>
          
          <h2 className="text-3xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-md">
            Your booking has been successfully processed. A confirmation has been sent to your email and WhatsApp.
          </p>
        </div>
        
        <Card className="w-full max-w-2xl mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Booking ID</p>
                <p className="font-medium">{bookingDetails.id}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Payment Status</p>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Paid
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Car</p>
                <p className="font-medium">{bookingDetails.car.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Payment Amount</p>
                <p className="font-medium">₹{bookingDetails.paymentInfo.tokenAmount.toFixed(2)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Dates</p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                  <p className="font-medium">
                    {format(bookingDetails.startDate, 'MMM dd')} - {format(bookingDetails.endDate, 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pickup Location</p>
                <p className="font-medium">{bookingDetails.startCity}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center text-gray-800 dark:text-gray-200">
                <Phone className="h-4 w-4 mr-2" />
                <p>Need assistance? Contact our support team at: <span className="font-semibold">+91-9876543210</span></p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            onClick={handleGoHome}
            className="min-w-[140px]"
          >
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
          
          <Button 
            onClick={onViewBookings}
            className={cn("min-w-[140px]")}
          >
            View My Bookings
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default BookingSuccess;
