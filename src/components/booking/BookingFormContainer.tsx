
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
import { 
  BookingBasicInfo, 
  BookingContactInfo, 
  BookingPaymentInfo, 
  saveBookingBasicInfo, 
  saveBookingContactInfo, 
  saveBookingPaymentInfo 
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
  const [tokenAmount, setTokenAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Calculate token amount (20% of estimated cost)
    if (datesData) {
      const estimatedCost = datesData.numDays * car.pricePerDay;
      setTotalAmount(estimatedCost);
      setTokenAmount(Math.round(estimatedCost * 0.2)); // 20% token amount
    }
  }, [datesData, car.pricePerDay]);

  const handleDatesSubmit = async (data: { startDate: Date; endDate: Date }) => {
    const numDays = Math.ceil(
      (data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    setDatesData({
      startDate: data.startDate,
      endDate: data.endDate,
      numDays,
    });

    try {
      // Save basic booking info
      const bookingData: BookingBasicInfo = {
        carId: car.id,
        startDate: data.startDate,
        endDate: data.endDate,
        startCity: contactData?.startCity || '',
        status: 'draft',
        userId: user?.uid
      };
      
      const id = await saveBookingBasicInfo(bookingData, user?.uid);
      setBookingId(id);
      
      // Move to next step
      setActiveStep(1);
    } catch (error) {
      console.error('Error saving dates:', error);
      toast.error('Failed to save booking dates. Please try again.');
    }
  };

  const handleContactSubmit = async (data: BookingContactInfo) => {
    setContactData(data);
    
    try {
      if (bookingId) {
        // Update booking with contact info
        await saveBookingContactInfo(bookingId, data);
        
        // Also update the booking with the starting city
        await saveBookingBasicInfo(
          {
            id: bookingId,
            carId: car.id,
            startDate: datesData!.startDate,
            endDate: datesData!.endDate,
            startCity: data.startCity,
            status: 'draft',
            userId: user?.uid
          },
          user?.uid
        );
        
        // Move to next step
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
      if (bookingId) {
        // Save payment info
        const paymentInfo: BookingPaymentInfo = {
          paymentMethod: 'upi',
          upiId: data.upiId,
          tokenAmount: tokenAmount,
          totalAmount: totalAmount,
          isPaid: true // In a real app, this would be set after payment confirmation
        };
        
        await saveBookingPaymentInfo(bookingId, paymentInfo);
        
        // Move to confirmation step
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
    navigate('/');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 overflow-hidden">
      <ProgressSteps activeStep={activeStep} />
      
      <div className="mt-8">
        {activeStep === 0 && (
          <DatesStep onSubmit={handleDatesSubmit} />
        )}
        
        {activeStep === 1 && contactData !== null && (
          <ContactStep 
            initialValues={contactData} 
            onSubmit={handleContactSubmit} 
            onBack={handleBackStep} 
          />
        )}
        
        {activeStep === 1 && contactData === null && (
          <ContactStep 
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
            onFinish={handleFinish}
          />
        )}
      </div>
    </div>
  );
};

export default BookingFormContainer;
