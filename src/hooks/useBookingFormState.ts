
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from '@/data/cars';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookingBasicInfo, 
  BookingContactInfo, 
  BookingPaymentInfo, 
  saveBookingBasicInfo, 
  saveBookingContactInfo, 
  saveBookingPaymentInfo,
  getBookingById
} from '@/services/bookingService';
import { 
  sendAllNotifications, 
  sendContactNotification,
  BookingNotificationDetails
} from '@/services/notificationService';
import { UpiFormData } from '@/components/booking/PaymentStep';
import { differenceInDays } from 'date-fns';

export const useBookingFormState = (car: Car) => {
  const [activeStep, setActiveStep] = useState(0);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [datesData, setDatesData] = useState<{
    startDate: Date;
    endDate: Date;
    numDays: number;
  } | null>(null);
  const [contactData, setContactData] = useState<BookingContactInfo | null>(null);
  const [tokenAmount] = useState(1000); // Fixed token amount of 1000 Rs
  const [totalAmount, setTotalAmount] = useState(0);
  const [baseKm] = useState(200); // Base 200 km included
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [paymentId, setPaymentId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
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
          setIsLoading(true);
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
          } finally {
            setIsLoading(false);
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
    setIsLoading(true);
    try {
      await signInWithGoogle();
      setActiveStep(1); // Move to contact info step after successful login
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSubmit = async (data: BookingContactInfo) => {
    setIsLoading(true);
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
        }
        
        // Update existing booking with contact info
        if (bookingId) {
          await saveBookingContactInfo(bookingId, data, user.uid);
        }
        
        // Update user's phone number if provided
        if (user && data.phone) {
          try {
            await updateUserPhone(data.phone);
          } catch (phoneError) {
            console.error('Error updating user phone:', phoneError);
          }
        }
        
        // Send notification to admin about new contact
        try {
          await sendContactNotification(data);
        } catch (notificationError) {
          console.error('Failed to send contact notification:', notificationError);
        }
        
        setActiveStep(2); // Move to dates step
      }
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast.error('Failed to save contact information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDatesSubmit = async (data: { startDate: Date; endDate: Date }) => {
    setIsLoading(true);
    const numDays = Math.max(1, differenceInDays(data.endDate, data.startDate) + 1);

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
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const handlePaymentSubmit = async (data: UpiFormData & { paymentMethod: string, paymentId?: string }) => {
    setIsLoading(true);
    try {
      if (bookingId && user) {
        setPaymentMethod(data.paymentMethod);
        if (data.paymentId) {
          setPaymentId(data.paymentId);
        }
        
        const paymentInfo: BookingPaymentInfo = {
          paymentMethod: data.paymentMethod as any,
          upiId: data.upiId,
          paymentId: data.paymentId,
          tokenAmount: tokenAmount,
          totalAmount: totalAmount,
          isPaid: true,
          paidAt: new Date()
        };
        
        await saveBookingPaymentInfo(bookingId, paymentInfo, user.uid);
        
        // Send WhatsApp and email notifications after successful booking
        if (contactData && datesData) {
          const bookingDetails: BookingNotificationDetails = {
            customerName: contactData.name,
            customerEmail: contactData.email,
            customerPhone: contactData.phone,
            carModel: car.model,
            carTitle: car.title,
            startDate: datesData.startDate.toLocaleDateString(),
            endDate: datesData.endDate.toLocaleDateString(),
            numDays: datesData.numDays,
            tokenAmount: tokenAmount,
            totalAmount: totalAmount,
            paymentMethod: data.paymentMethod,
            paymentId: data.paymentId
          };
          
          try {
            await sendAllNotifications(bookingDetails);
            console.log('Notifications sent successfully');
          } catch (notificationError) {
            console.error('Failed to send notifications:', notificationError);
          }
        }
        
        setActiveStep(4); // Move to confirmation step
      } else {
        toast.error('Booking not found. Please start again.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBackStep = () => {
    setActiveStep(prev => Math.max(0, prev - 1));
    
    // Skip login step when going back if user is already logged in
    if (activeStep === 1 && user) {
      setActiveStep(0);
    }
  };
  
  const handleFinish = () => {
    toast.success("Booking confirmed! We'll contact you soon.");
    navigate('/my-bookings');
  };

  return {
    activeStep,
    setActiveStep,
    bookingId,
    datesData,
    contactData,
    tokenAmount,
    totalAmount,
    baseKm,
    user,
    loading,
    isLoading,
    paymentMethod,
    paymentId,
    handleLoginWithGoogle,
    handleContactSubmit,
    handleDatesSubmit,
    handlePaymentSubmit,
    handleBackStep,
    handleFinish
  };
};
