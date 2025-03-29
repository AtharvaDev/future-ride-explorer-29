
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
import { sendWhatsAppNotification } from '@/services/notificationService';
import { UpiFormData } from '@/components/booking/PaymentStep';

export const useBookingFormState = (car: Car) => {
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
    handleLoginWithGoogle,
    handleContactSubmit,
    handleDatesSubmit,
    handlePaymentSubmit,
    handleBackStep,
    handleFinish
  };
};
