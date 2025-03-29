
import React from 'react';
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
  const {
    activeStep,
    datesData,
    contactData,
    tokenAmount,
    totalAmount,
    baseKm,
    handleLoginWithGoogle,
    handleContactSubmit,
    handleDatesSubmit,
    handlePaymentSubmit,
    handleBackStep,
    handleFinish
  } = useBookingFormState(car);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 overflow-hidden">
      <ProgressSteps activeStep={activeStep} />
      
      <div className="mt-8">
        {activeStep === 0 && (
          <LoginStep onLoginWithGoogle={handleLoginWithGoogle} />
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
