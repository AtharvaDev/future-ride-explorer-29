
import React, { useState, useEffect } from 'react';
import { Car } from '@/data/cars';
import ProgressSteps from './ProgressSteps';
import DatesStep from './DatesStep';
import ContactStep from './ContactStep';
import PaymentStep from './PaymentStep';
import ConfirmationStep from './ConfirmationStep';
import LoginStep from './LoginStep';
import { useBookingFormState } from '@/hooks/useBookingFormState';
import { UpiFormData } from './PaymentStep';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { BookingContactInfo } from '@/types/booking';

interface BookingFormContainerProps {
  car: Car;
}

const BookingFormContainer: React.FC<BookingFormContainerProps> = ({ car }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [baseKm] = useState(100); // Base kilometers included in package
  const { user } = useAuth();
  
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
    goToStep,
    resetStep
  } = useBookingFormState(car);

  // Reset to step 1 if no user is logged in
  useEffect(() => {
    if (!user) {
      resetStep();
    }
  }, [user, resetStep]);

  // Handle various step submissions
  const handleLoginWithGoogle = async (): Promise<void> => {
    try {
      setIsLoading(true);
      // We'll use the actual Firebase authentication in the LoginStep component
      // Just simulating the login process success here
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setIsLoading(false);
          if (user) {
            setLoginMethod('google');
            nextStep();
          }
          resolve();
        }, 1000);
      });
    } catch (error) {
      setIsLoading(false);
      toast.error('Login failed. Please try again.');
      return Promise.reject(error);
    }
  };

  // Auto-populate contact info when user is available
  useEffect(() => {
    if (user && formState.step >= 2) {
      // Populate contact info from user data
      setContactInfo({
        name: user.displayName || '',
        email: user.email || '',
        phone: user.phone || '',
        startCity: formState.startCity,
        address: '', // Add empty address field
        specialRequests: ''
      });
    }
  }, [user, formState.step, setContactInfo, formState.startCity]);

  const handleContactSubmit = (contactData: BookingContactInfo) => {
    setContactInfo(contactData);
    nextStep();
  };

  const handleDatesSubmit = () => {
    nextStep();
  };

  const handlePaymentSubmit = (data: UpiFormData & { paymentMethod: string, paymentId?: string }) => {
    setIsLoading(true);
    setPaymentMethod(data.paymentMethod);
    
    // If paymentId is provided, set it
    if (data.paymentId) {
      setPaymentId(data.paymentId);
    }
    
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      if (!data.paymentId) {
        setPaymentId("pay_" + Math.random().toString(36).substring(2, 15));
      }
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

  // Prevent accessing steps beyond login if not logged in
  const isStepAccessible = (step: number) => {
    if (step === 1) return true; // Login step is always accessible
    return !!user; // Other steps require user to be logged in
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 overflow-hidden">
      <ProgressSteps activeStep={formState.step} />
      
      <div className="mt-8">
        {formState.step === 1 && (
          <LoginStep 
            onLoginWithGoogle={handleLoginWithGoogle} 
            isLoading={isLoading}
            isLoggedIn={!!user}
            onContinue={nextStep}
          />
        )}
        
        {formState.step === 2 && isStepAccessible(2) && (
          <ContactStep 
            initialValues={formState.contactInfo} 
            onSubmit={handleContactSubmit} 
            onBack={formState.step > 1 ? handleBackStep : undefined}
            isLoading={isLoading}
          />
        )}
        
        {formState.step === 3 && isStepAccessible(3) && (
          <DatesStep 
            formState={formState}
            bookingSummary={bookingSummary}
            onDateChange={setDates}
            onCityChange={setStartCity}
            onNext={handleDatesSubmit}
            onBack={handleBackStep}
          />
        )}
        
        {formState.step === 4 && isStepAccessible(4) && (
          <PaymentStep 
            tokenAmount={bookingSummary.tokenAmount} 
            onSubmit={handlePaymentSubmit} 
            onBack={handleBackStep}
            isLoading={isLoading}
            contactInfo={formState.contactInfo}
          />
        )}
        
        {formState.step === 5 && isStepAccessible(5) && (
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
