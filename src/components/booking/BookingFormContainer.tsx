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
import { sendWhatsAppNotification } from '@/services/notificationService';

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
  const { user, loading, signInWithGoogle, updateUserPhone } = useAuth();

  useEffect(() => {
    if (datesData) {
      const estimatedCost = datesData.numDays * car.pricePerDay;
      setTotalAmount(estimatedCost);
    }
  }, [datesData, car.pricePerDay]);

  useEffect(() => {
    // If user is already logged in, skip the login step
    if (user && !loading && activeStep === 0) {
      setActiveStep(1);
    }
    
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
  }, [user, loading, bookingId, activeStep]);

  const handleLoginWithGoogle = async () => {
    try {
      await signInWithGoogle();
      setActiveStep(1); // Move to contact info step after successful login
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Failed to sign in with Google. Please try again.');
    }
  };

  const handleContactSubmit = async (data: BookingContactInfo) => {
    setContactData(data);
    
    try {
      if (user) {
        // Create a new booking if one doesn't exist
        if (!bookingId) {
          const bookingData: BookingBasicInfo = {
            carId: car.id,
            startDate: new Date(),
            endDate: new Date(),
            startCity: data.startCity,
            status: 'draft',
            userId: user.uid
          };
          
          const id = await saveBookingBasicInfo(bookingData, user.uid);
          setBookingId(id);
        } else {
          // Update existing booking with contact info
          await saveBookingContactInfo(bookingId, data, user.uid);
        }
        
        if (user && data.phone) {
          try {
            await updateUserPhone(data.phone);
          } catch (phoneError) {
            console.error('Error updating user phone:', phoneError);
          }
        }
        
        setActiveStep(2); // Move to dates step
      }
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast.error('Failed to save contact information. Please try again.');
    }
  };

  const handleDatesSubmit = async (data: { startDate: Date; endDate: Date }) => {
    const numDays = Math.ceil(
      (data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    setDatesData({
      startDate: data.startDate,
      endDate: data.endDate,
      numDays,
    });

    if (user && bookingId) {
      try {
        const bookingData: BookingBasicInfo = {
          id: bookingId,
          carId: car.id,
          startDate: data.startDate,
          endDate: data.endDate,
          startCity: contactData?.startCity || '',
          status: 'draft',
          userId: user.uid
        };
        
        await saveBookingBasicInfo(bookingData, user.uid);
        setActiveStep(3); // Move to payment step
      } catch (error) {
        console.error('Error saving dates:', error);
        toast.error('Failed to save booking dates. Please try again.');
      }
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
        
        // Correct order of parameters - bookingId, paymentInfo, user.uid
        await saveBookingPaymentInfo(bookingId, paymentInfo, user.uid);
        
        // Send WhatsApp notification after successful booking
        if (contactData) {
          const bookingDetails = {
            customerName: contactData.name,
            carModel: car.model,
            carTitle: car.title,
            startDate: datesData?.startDate ? datesData.startDate.toLocaleDateString() : '',
            endDate: datesData?.endDate ? datesData.endDate.toLocaleDateString() : '',
            numDays: datesData?.numDays || 0,
            tokenAmount: tokenAmount,
            totalAmount: totalAmount,
            customerPhone: contactData.phone
          };
          
          try {
            await sendWhatsAppNotification(bookingDetails);
            console.log('WhatsApp notification sent successfully');
          } catch (notificationError) {
            console.error('Failed to send WhatsApp notification:', notificationError);
            // Don't block the booking process if notification fails
          }
        }
        
        setActiveStep(4); // Move to confirmation step
      } else {
        toast.error('Booking not found. Please start again.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment. Please try again.');
    }
  };
  
  const handleBackStep = () => {
    setActiveStep(activeStep => Math.max(0, activeStep - 1));
    
    // Skip login step when going back if user is already logged in
    if (activeStep === 1 && user) {
      setActiveStep(activeStep => Math.max(0, activeStep - 1));
    }
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
          <div className="step-container space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Login to Continue</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Please login with your Google account to continue with the booking process.
              </p>
            </div>
            
            <div className="flex flex-col items-center justify-center py-6">
              <Button 
                onClick={handleLoginWithGoogle} 
                className="w-full max-w-md flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 py-6"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Continue with Google
              </Button>
              
              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  You'll be able to manage your bookings after logging in.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {activeStep === 1 && (
          <ContactStep 
            initialValues={contactData || undefined} 
            onSubmit={handleContactSubmit} 
            onBack={activeStep > 1 ? handleBackStep : undefined} 
          />
        )}
        
        {activeStep === 2 && (
          <DatesStep 
            car={car}
            onSubmit={handleDatesSubmit}
            startDate={datesData?.startDate}
            endDate={datesData?.endDate}
            numberOfDays={datesData?.numDays || 0}
            totalCost={totalAmount}
            tokenAmount={tokenAmount}
            onBack={handleBackStep}
          />
        )}
        
        {activeStep === 3 && (
          <PaymentStep 
            tokenAmount={tokenAmount} 
            onSubmit={handlePaymentSubmit} 
            onBack={handleBackStep} 
          />
        )}
        
        {activeStep === 4 && datesData && (
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
