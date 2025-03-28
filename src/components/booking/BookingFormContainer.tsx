import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from '@/data/cars';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import ProgressSteps from './ProgressSteps';
import DatesStep from './DatesStep';
import ContactStep from './ContactStep';
import PaymentStep, { UpiFormData } from './PaymentStep';
import ConfirmationStep from './ConfirmationStep';
import { useAuth } from '@/contexts/AuthContext';
import LoginPrompt from './LoginPrompt';
import { 
  BookingBasicInfo, 
  BookingContactInfo, 
  BookingPaymentInfo, 
  saveBookingBasicInfo, 
  saveBookingContactInfo, 
  saveBookingPaymentInfo,
  getBookingById
} from '@/services/bookingService';

interface BookingFormContainerProps {
  car: Car;
}

const BookingFormContainer: React.FC<BookingFormContainerProps> = ({ car }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [datesData, setDatesData] = useState<{
    startDate: Date;
    endDate: Date;
    numDays: number;
  } | null>(null);
  const [contactData, setContactData] = useState<BookingContactInfo | null>(null);
  const [tokenAmount, setTokenAmount] = useState(1000); // Fixed token amount of 1000 Rs
  const [totalAmount, setTotalAmount] = useState(0);
  const [baseKm, setBaseKm] = useState(200); // Base 200 km included
  
  const navigate = useNavigate();
  const { user, loading, updateUserPhone } = useAuth();

  useEffect(() => {
    if (datesData) {
      const estimatedCost = datesData.numDays * car.pricePerDay;
      setTotalAmount(estimatedCost);
    }
  }, [datesData, car.pricePerDay]);

  useEffect(() => {
    if (user && !loading) {
      if (bookingId) {
        const fetchBooking = async () => {
          try {
            const booking = await getBookingById(user.uid, bookingId);
            if (booking && booking.contactInfo) {
              setContactData(booking.contactInfo);
            } else {
              setContactData({
                name: user.displayName || '',
                email: user.email || '',
                phone: user.phone || '',
                startCity: '',
                specialRequests: ''
              });
            }
          } catch (error) {
            console.error('Error fetching booking:', error);
          }
        };
        
        fetchBooking();
      } else {
        setContactData({
          name: user.displayName || '',
          email: user.email || '',
          phone: user.phone || '',
          startCity: '',
          specialRequests: ''
        });
      }
    }
  }, [user, loading, bookingId]);

  const handleDatesSubmit = async (data: { startDate: Date; endDate: Date }) => {
    const numDays = Math.ceil(
      (data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    setDatesData({
      startDate: data.startDate,
      endDate: data.endDate,
      numDays,
    });

    if (user) {
      try {
        const bookingData: BookingBasicInfo = {
          carId: car.id,
          startDate: data.startDate,
          endDate: data.endDate,
          startCity: contactData?.startCity || '',
          status: 'draft',
          userId: user.uid
        };
        
        const id = await saveBookingBasicInfo(bookingData, user.uid);
        setBookingId(id);
        
        setActiveStep(1);
      } catch (error) {
        console.error('Error saving dates:', error);
        toast.error('Failed to save booking dates. Please try again.');
      }
    } else {
      // If not logged in, we'll show the login prompt in the UI
      // but we won't advance the step until they log in
    }
  };

  const handleContactSubmit = async (data: BookingContactInfo) => {
    setContactData(data);
    
    try {
      if (bookingId && user) {
        await saveBookingContactInfo(bookingId, data, user.uid);
        
        await saveBookingBasicInfo(
          {
            id: bookingId,
            carId: car.id,
            startDate: datesData!.startDate,
            endDate: datesData!.endDate,
            startCity: data.startCity,
            status: 'draft',
            userId: user.uid
          },
          user.uid
        );
        
        if (user && data.phone) {
          try {
            await updateUserPhone(data.phone);
          } catch (phoneError) {
            console.error('Error updating user phone:', phoneError);
          }
        }
        
        setActiveStep(2);
      } else {
        toast.error('Booking not found. Please start again.');
      }
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast.error('Failed to save contact information. Please try again.');
    }
  };

  const handlePaymentSubmit = async (data: UpiFormData) => {
    try {
      if (bookingId && user) {
        const paymentInfo: BookingPaymentInfo = {
          paymentMethod: 'upi',
          upiId: data.upiId,
          tokenAmount: tokenAmount,
          totalAmount: totalAmount,
          isPaid: true
        };
        
        await saveBookingPaymentInfo(bookingId, paymentInfo, user.uid);
        
        setActiveStep(3);
      } else {
        toast.error('Booking not found. Please start again.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment. Please try again.');
    }
  };
  
  const handleBackStep = () => {
    setActiveStep(prevStep => Math.max(0, prevStep - 1));
  };
  
  const handleFinish = () => {
    toast.success("Booking confirmed! We'll contact you soon.");
    navigate('/my-bookings');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 overflow-hidden">
      <ProgressSteps activeStep={activeStep} />
      
      <div className="mt-8">
        {activeStep === 0 && (
          <>
            <DatesStep 
              car={car}
              onSubmit={handleDatesSubmit}
              startDate={datesData?.startDate}
              endDate={datesData?.endDate}
              numberOfDays={datesData?.numDays || 0}
              totalCost={totalAmount}
              tokenAmount={tokenAmount}
            />
            
            {!user && !loading && datesData && (
              <LoginPrompt />
            )}
          </>
        )}
        
        {activeStep === 1 && (
          <ContactStep 
            initialValues={contactData || undefined} 
            onSubmit={handleContactSubmit} 
            onBack={handleBackStep} 
          />
        )}
        
        {activeStep === 2 && (
          <PaymentStep 
            tokenAmount={tokenAmount} 
            onSubmit={handlePaymentSubmit} 
            onBack={handleBackStep} 
          />
        )}
        
        {activeStep === 3 && datesData && (
          <ConfirmationStep
            car={car}
            startDate={datesData.startDate}
            endDate={datesData.endDate}
            numDays={datesData.numDays}
            tokenAmount={tokenAmount}
            totalAmount={totalAmount}
            baseKm={baseKm}
            pricePerKm={car.pricePerKm}
            onFinish={handleFinish}
          />
        )}
      </div>
    </div>
  );
};

export default BookingFormContainer;
