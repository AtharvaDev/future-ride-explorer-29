
import React, { useState, useEffect, useRef } from 'react';
import { Car } from '@/data/cars';
import { format, addDays, differenceInDays } from "date-fns";
import { toast } from "sonner";
import gsap from 'gsap';

// Import our new components
import ProgressSteps, { BookingStep } from './booking/ProgressSteps';
import ContactStep, { ContactFormData } from './booking/ContactStep';
import DatesStep from './booking/DatesStep';
import PaymentStep, { UpiFormData } from './booking/PaymentStep';
import ConfirmationStep from './booking/ConfirmationStep';

interface BookingFormProps {
  car: Car;
}

const BookingForm: React.FC<BookingFormProps> = ({ car }) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>('contact');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [totalCost, setTotalCost] = useState(car.pricePerDay);
  const [tokenAmount, setTokenAmount] = useState(1000);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [googleSignedIn, setGoogleSignedIn] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Calculate the number of days and total cost
  useEffect(() => {
    if (startDate && endDate) {
      const days = Math.max(differenceInDays(endDate, startDate) + 1, 1);
      setNumberOfDays(days);
      setTotalCost(car.pricePerDay * days);
      setTokenAmount(1000 * days);
    }
  }, [startDate, endDate, car.pricePerDay]);

  // Animate step transitions
  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        '.step-container',
        { 
          opacity: 0, 
          y: 20 
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5,
          ease: 'power2.out'
        }
      );
    }
  }, [currentStep]);

  // Handle Google Sign In
  const handleGoogleSignIn = () => {
    // Animate button
    gsap.to('.google-btn', {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });
    
    // Simulate loading
    toast.loading('Connecting to Google...');
    
    // Simulate Google auth
    setTimeout(() => {
      setGoogleSignedIn(true);
      toast.success('Signed in with Google');
    }, 1500);
  };

  // Handle contact form submission
  const handleContactSubmit = (data: ContactFormData) => {
    // Animate button
    gsap.to('.next-btn', {
      x: 10,
      duration: 0.2,
      yoyo: true,
      repeat: 1
    });
    
    // Save contact details and move to next step
    setBookingDetails(prev => ({ ...prev, contact: data }));
    setCurrentStep('dates');
  };

  // Handle UPI form submission
  const handleUpiSubmit = (data: UpiFormData) => {
    // Animate button
    gsap.to('.pay-btn', {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });
    
    // Show payment processing
    toast.loading('Processing payment...');
    
    // Simulate payment processing
    setTimeout(() => {
      setBookingDetails(prev => ({ 
        ...prev, 
        payment: {
          method: 'UPI',
          details: data.upiId,
          amount: tokenAmount,
          transactionId: 'UPI' + Math.random().toString(36).substr(2, 9).toUpperCase()
        },
        booking: {
          carId: car.id,
          carModel: car.model,
          carTitle: car.title,
          startDate: startDate,
          endDate: endDate,
          numberOfDays: numberOfDays,
          totalCost: totalCost,
          tokenAmount: tokenAmount
        }
      }));
      setBookingConfirmed(true);
      setCurrentStep('confirmation');
      toast.success('Payment successful!');

      // Create confetti effect on payment success
      const container = formRef.current;
      if (container) {
        for (let i = 0; i < 50; i++) {
          const confetti = document.createElement('div');
          confetti.className = 'absolute rounded-full pointer-events-none';
          confetti.style.width = `${Math.random() * 10 + 5}px`;
          confetti.style.height = `${Math.random() * 10 + 5}px`;
          confetti.style.background = `hsl(${Math.random() * 360}, 80%, 60%)`;
          confetti.style.position = 'absolute';
          confetti.style.zIndex = '50';
          container.appendChild(confetti);
          
          gsap.fromTo(
            confetti,
            {
              x: container.clientWidth / 2,
              y: container.clientHeight / 2,
              opacity: 1
            },
            {
              x: `random(${-container.clientWidth/2}, ${container.clientWidth/2})`,
              y: `random(${-container.clientHeight/2}, ${container.clientHeight/2})`,
              opacity: 0,
              duration: 2,
              ease: 'power2.out',
              onComplete: () => {
                container.removeChild(confetti);
              }
            }
          );
        }
      }
    }, 2000);
  };

  // Handle receipt download
  const handleDownloadReceipt = () => {
    // Animate button
    gsap.to('.download-btn', {
      y: -5,
      duration: 0.2,
      yoyo: true,
      repeat: 1
    });
    
    toast.success('Receipt downloaded successfully!');
  };

  return (
    <div ref={formRef} className="glass-panel p-6 rounded-2xl relative overflow-hidden">
      {/* Progress Steps */}
      <ProgressSteps currentStep={currentStep} />
      
      {/* Step Content */}
      {currentStep === 'contact' && (
        <ContactStep 
          onSubmit={handleContactSubmit}
          googleSignedIn={googleSignedIn}
          onGoogleSignIn={handleGoogleSignIn}
          defaultValues={bookingDetails?.contact}
        />
      )}
      
      {currentStep === 'dates' && (
        <DatesStep 
          car={car}
          startDate={startDate}
          endDate={endDate}
          numberOfDays={numberOfDays}
          totalCost={totalCost}
          tokenAmount={tokenAmount}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onNext={() => setCurrentStep('payment')}
          onBack={() => setCurrentStep('contact')}
        />
      )}
      
      {currentStep === 'payment' && (
        <PaymentStep 
          tokenAmount={tokenAmount}
          onSubmit={handleUpiSubmit}
          onBack={() => setCurrentStep('dates')}
        />
      )}
      
      {currentStep === 'confirmation' && bookingDetails && (
        <ConfirmationStep 
          bookingDetails={bookingDetails}
          car={car}
          startDate={startDate}
          endDate={endDate}
          numberOfDays={numberOfDays}
          totalCost={totalCost}
          tokenAmount={tokenAmount}
          onDownloadReceipt={handleDownloadReceipt}
        />
      )}
    </div>
  );
};

export default BookingForm;
