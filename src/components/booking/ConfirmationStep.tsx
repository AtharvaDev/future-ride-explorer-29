import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';
import { ArrowLeft, CheckCircle, Clock, Calendar, Car, Map, Phone, Mail, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '@/services/booking/createBookingService';
import { Car as CarType } from '@/data/cars';
import { BookingFormState, BookingSummary } from '@/hooks/useBookingFormState';
import { toast } from 'sonner';
import { sendBookingConfirmation } from '@/services/notificationService';

interface ConfirmationStepProps {
  formState: BookingFormState;
  bookingSummary: BookingSummary;
  car: CarType;
  onPrevious: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  formState,
  bookingSummary,
  car,
  onPrevious,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleConfirmBooking = async () => {
    if (!formState.startDate || !formState.endDate) {
      toast.error('Please select valid booking dates');
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingData = {
        carId: car.id,
        userId: user?.uid || 'guest',
        startDate: formState.startDate,
        endDate: formState.endDate,
        startCity: formState.startCity,
        status: 'confirmed',
        contactInfo: {
          name: formState.contactInfo.name,
          email: formState.contactInfo.email,
          phone: formState.contactInfo.phone,
          address: formState.contactInfo.address,
          startCity: formState.startCity,
          specialRequests: formState.contactInfo.specialRequests || '',
        },
        paymentInfo: {
          method: formState.paymentMethod,
          totalAmount: bookingSummary.totalAmount,
          tokenAmount: bookingSummary.tokenAmount,
          isPaid: true,
          paidAt: new Date(),
        },
        createdAt: new Date(),
        car: {
          id: car.id,
          name: car.title,
          image: car.image,
          pricePerDay: car.pricePerDay
        }
      };

      const newBooking = await createBooking(bookingData);
      
      await sendBookingConfirmation({
        id: newBooking.id,
        ...bookingData
      }, user);
      
      toast.success('Booking confirmed successfully!');
      navigate('/my-bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to confirm booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Booking Summary</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Please review your booking details before confirming
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Car className="w-5 h-5 mr-2 text-primary" />
              Car Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <img 
                  src={car.image} 
                  alt={car.title} 
                  className="w-20 h-20 object-cover rounded-lg mr-4" 
                />
                <div>
                  <h4 className="font-medium">{car.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{car.model}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Daily Rate</p>
                  <p className="font-medium">₹{bookingSummary.dailyRate}/day</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mileage Fee</p>
                  <p className="font-medium">₹{car.pricePerKm}/km</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Trip Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
                  <p className="font-medium">
                    {formState.startDate ? format(formState.startDate, 'MMM dd, yyyy') : 'Not selected'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">End Date</p>
                  <p className="font-medium">
                    {formState.endDate ? format(formState.endDate, 'MMM dd, yyyy') : 'Not selected'}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-primary" />
                  <p className="font-medium">{bookingSummary.totalDays} days</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pickup Location</p>
                <div className="flex items-center">
                  <Map className="w-4 h-4 mr-1 text-primary" />
                  <p className="font-medium">{formState.startCity}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" />
              Contact Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                <p className="font-medium">{formState.contactInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-1 text-primary" />
                  <p className="font-medium">{formState.contactInfo.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-1 text-primary" />
                  <p className="font-medium">{formState.contactInfo.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                <p className="font-medium">{formState.contactInfo.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-primary" />
              Payment Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-gray-500 dark:text-gray-400">Rental ({bookingSummary.totalDays} days × ₹{bookingSummary.dailyRate})</p>
                <p>₹{bookingSummary.subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500 dark:text-gray-400">Tax (18% GST)</p>
                <p>₹{bookingSummary.tax.toFixed(2)}</p>
              </div>
              <div className="border-t my-2"></div>
              <div className="flex justify-between font-semibold">
                <p>Total Amount</p>
                <p>₹{bookingSummary.totalAmount.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t">
                <p className="text-primary font-medium">Token Amount (20%)</p>
                <p className="text-primary font-semibold">₹{bookingSummary.tokenAmount.toFixed(2)}</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                * Remaining amount to be paid at pickup
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <Button 
          onClick={handleConfirmBooking} 
          disabled={isSubmitting}
          className="bg-primary text-white min-w-[150px]"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              Processing...
            </>
          ) : (
            'Confirm Booking'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
