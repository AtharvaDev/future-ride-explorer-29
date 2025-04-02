import React, { useState, useEffect } from 'react';
import { Car } from '@/data/cars';
import { useNavigate } from 'react-router-dom';
import ProgressSteps from './ProgressSteps';
import DatesStep from './DatesStep';
import ContactStep from './ContactStep';
import PaymentStep from './PaymentStep';
import ConfirmationStep from './ConfirmationStep';
import LoginStep from './LoginStep';
import BookingSuccess from './BookingSuccess';
import { useBookingFormState } from '@/hooks/useBookingFormState';
import { UpiFormData } from './PaymentStep';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { BookingContactInfo, BookingStatus } from '@/types/booking';
import { gsap } from '@/lib/gsap';
import { createBooking } from '@/services/booking/createBookingService';
import { 
  sendBookingConfirmation, 
  sendBookingAttemptNotification,
  sendNewUserSignupNotification,
  sendProfileUpdateNotification
} from '@/services/notificationService';
import { BookingNotificationDetails } from '@/types/notifications';

interface BookingFormContainerProps {
  car: Car;
}

const BookingFormContainer: React.FC<BookingFormContainerProps> = ({ car }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [formReady, setFormReady] = useState(false);
  const [bookingCreated, setBookingCreated] = useState<BookingNotificationDetails | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
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

  const formContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      resetStep();
    }
  }, [user, resetStep]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFormReady(true);
      
      gsap.fromTo(
        ".booking-form-content",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLoginWithGoogle = async (): Promise<void> => {
    try {
      setIsLoading(true);
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setIsLoading(false);
          if (user) {
            setLoginMethod('google');
            
            if (user.metadata && user.metadata.creationTime) {
              const creationTime = new Date(user.metadata.creationTime);
              const now = new Date();
              const timeDiff = Math.abs(now.getTime() - creationTime.getTime());
              const isNewUser = timeDiff < 60000;
              
              if (isNewUser) {
                sendNewUserSignupNotification(user).catch(console.error);
              }
            }
            
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

  useEffect(() => {
    if (user && formState.step >= 2) {
      setContactInfo({
        name: user.displayName || '',
        email: user.email || '',
        phone: user.phone || '',
        startCity: formState.startCity,
        specialRequests: ''
      });
    }
  }, [user, formState.step, setContactInfo, formState.startCity]);

  const handleContactSubmit = (contactData: BookingContactInfo) => {
    setContactInfo(contactData);
    setStartCity(contactData.startCity);
    
    if (user) {
      if (user.phone !== contactData.phone) {
        sendProfileUpdateNotification(user, {
          phone: contactData.phone
        }).catch(console.error);
      }
    }
    
    sendBookingAttemptNotification(user, car, contactData).catch(console.error);
    
    nextStep();
  };

  const handleDatesSubmit = () => {
    nextStep();
  };

  const handleConfirmationSubmit = () => {
    nextStep();
  };

  const handlePaymentSubmit = async (data: UpiFormData & { paymentMethod: string, paymentId?: string }) => {
    setIsLoading(true);
    setPaymentMethod(data.paymentMethod);
    
    if (data.paymentId) {
      setPaymentId(data.paymentId);
    } else {
      setPaymentId("pay_" + Math.random().toString(36).substring(2, 15));
    }
    
    try {
      if (user) {
        const bookingData = {
          userId: user.uid,
          carId: car.id,
          startDate: formState.startDate!,
          endDate: formState.endDate!,
          startCity: formState.contactInfo.startCity,
          status: BookingStatus.CONFIRMED,
          contactInfo: formState.contactInfo,
          paymentInfo: {
            method: data.paymentMethod,
            paymentId: data.paymentId || paymentId,
            totalAmount: bookingSummary.totalAmount,
            tokenAmount: bookingSummary.tokenAmount,
            isPaid: true,
            paidAt: new Date()
          }
        };
        
        const result = await createBooking(bookingData);
        
        if (result && result.id) {
          const notificationDetails: BookingNotificationDetails = {
            id: result.id,
            userId: user.uid,
            carId: car.id,
            startDate: formState.startDate!,
            endDate: formState.endDate!,
            startCity: formState.contactInfo.startCity,
            status: BookingStatus.CONFIRMED,
            contactInfo: formState.contactInfo,
            paymentInfo: {
              method: data.paymentMethod,
              totalAmount: bookingSummary.totalAmount,
              tokenAmount: bookingSummary.tokenAmount,
              isPaid: true,
              paidAt: new Date()
            },
            car: {
              id: car.id,
              name: `${car.model} ${car.title}`,
              image: car.image,
              pricePerDay: car.pricePerDay
            }
          };
          
          await sendBookingConfirmation(notificationDetails, user);
          
          setBookingCreated(notificationDetails);
          nextStep();
          toast.success("Booking confirmed successfully!");
        } else {
          toast.error("Failed to create booking. Please try again.");
        }
      } else {
        toast.error("User not logged in. Please log in and try again.");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("An error occurred while processing your booking.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackStep = () => {
    prevStep();
  };
  
  const handleViewBookings = () => {
    navigate('/my-bookings');
  };

  const isStepAccessible = (step: number) => {
    if (step === 1) return true;
    return !!user;
  };

  const steps = ["Login", "Contact", "Dates", "Review", "Payment", "Complete"];

  useEffect(() => {
    if (formContainerRef.current) {
      gsap.to(formContainerRef.current.querySelector('.booking-form-content'), {
        opacity: 0,
        y: -10,
        duration: 0.2,
        onComplete: () => {
          gsap.to(formContainerRef.current?.querySelector('.booking-form-content'), {
            opacity: 1,
            y: 0,
            duration: 0.3,
            delay: 0.1
          });
        }
      });
    }
  }, [formState.step]);

  return (
    <div ref={formContainerRef} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 overflow-hidden z-10 relative">
      <ProgressSteps 
        activeStep={formState.step - 1} 
        steps={steps.slice(0, formState.step > 5 ? 6 : 5)}
      />
      
      <div className="mt-8 booking-form-content">
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
            onNext={handleDatesSubmit}
            onBack={handleBackStep}
          />
        )}
        
        {formState.step === 4 && isStepAccessible(4) && (
          <ConfirmationStep
            formState={formState}
            bookingSummary={bookingSummary}
            car={car} 
            onPrevious={handleBackStep}
            onNext={handleConfirmationSubmit}
          />
        )}
        
        {formState.step === 5 && isStepAccessible(5) && (
          <PaymentStep 
            tokenAmount={bookingSummary.tokenAmount} 
            onSubmit={handlePaymentSubmit} 
            onBack={handleBackStep}
            isLoading={isLoading}
            contactInfo={formState.contactInfo}
          />
        )}
        
        {formState.step === 6 && bookingCreated && (
          <BookingSuccess 
            bookingDetails={bookingCreated}
            onViewBookings={handleViewBookings}
          />
        )}
      </div>
    </div>
  );
};

export default BookingFormContainer;
