
import React, { useState } from 'react';
import { Car } from '@/data/cars';
import ProgressSteps from './ProgressSteps';
import DatesStep from './DatesStep';
import ContactStep from './ContactStep';
import PaymentStep from './PaymentStep';
import ConfirmationStep from './ConfirmationStep';
import LoginStep from './LoginStep';
import { useBookingFormState } from '@/hooks/useBookingFormState';

interface BookingFormContainerProps {
  car: Car;
}

const BookingFormContainer: React.FC<BookingFormContainerProps> = ({ car }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [baseKm] = useState(100); // Base kilometers included in package
  
  const {
    formState,
    bookingSummary,
    setDates,
    setStartCity,
    setContactInfo,
    setLoginMethod,
    setPaymentMethod,
    nextStep,
    prevStep,
    goToStep
  } = useBookingFormState(car);

  // Handle various step submissions
  const handleLoginWithGoogle = () => {
    // In a real app, this would handle Google login
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      nextStep();
    }, 1000);
  };

  const handleContactSubmit = (contactData: any) => {
    setContactInfo(contactData);
    nextStep();
  };

  const handleDatesSubmit = () => {
    nextStep();
  };

  const handlePaymentSubmit = (method: string) => {
    setIsLoading(true);
    setPaymentMethod(method);
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      setPaymentId("pay_" + Math.random().toString(36).substring(2, 15));
      nextStep();
    }, 1500);
  };

  const handleBackStep = () => {
    prevStep();
  };

  const handleFinish = () => {
    // Implementation for finishing the booking process
    goToStep(1);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 overflow-hidden">
      <ProgressSteps activeStep={formState.step} />
      
      <div className="mt-8">
        {formState.step === 1 && (
          <LoginStep onLoginWithGoogle={handleLoginWithGoogle} isLoading={isLoading} />
        )}
        
        {formState.step === 2 && (
          <ContactStep 
            initialValues={formState.contactInfo} 
            onSubmit={handleContactSubmit} 
            onBack={formState.step > 1 ? handleBackStep : undefined}
            isLoading={isLoading}
          />
        )}
        
        {formState.step === 3 && (
          <DatesStep 
            onSubmit={handleDatesSubmit}
            startDate={formState.startDate}
            endDate={formState.endDate}
            numberOfDays={bookingSummary.totalDays}
            totalCost={bookingSummary.totalAmount}
            tokenAmount={bookingSummary.tokenAmount}
            onBack={handleBackStep}
            isLoading={isLoading}
          />
        )}
        
        {formState.step === 4 && (
          <PaymentStep 
            tokenAmount={bookingSummary.tokenAmount} 
            onSubmit={handlePaymentSubmit} 
            onBack={handleBackStep}
            isLoading={isLoading}
            contactInfo={formState.contactInfo}
          />
        )}
        
        {formState.step === 5 && (
          <ConfirmationStep
            formState={formState}
            bookingSummary={bookingSummary}
            car={car} 
            onPrevious={handleBackStep}
          />
        )}
      </div>
    </div>
  );
};

export default BookingFormContainer;
