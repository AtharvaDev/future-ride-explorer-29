
import React from 'react';
import { format } from 'date-fns';
import { Car } from '@/data/cars';
import { Button } from '@/components/ui/button';
import { Check, Download, WhatsApp } from 'lucide-react';
import { generateBookingReceipt } from '@/services/pdfService';
import { BookingNotificationDetails } from '@/services/notificationService';

interface ConfirmationStepProps {
  car: Car;
  startDate: Date;
  endDate: Date;
  numDays: number;
  tokenAmount: number;
  totalAmount: number;
  baseKm: number;
  pricePerKm: number;
  onFinish: () => void;
  contactInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  paymentMethod?: string;
  paymentId?: string;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  car,
  startDate,
  endDate,
  numDays,
  tokenAmount,
  totalAmount,
  baseKm,
  pricePerKm,
  onFinish,
  contactInfo,
  paymentMethod = 'upi',
  paymentId
}) => {
  
  const handleDownloadReceipt = async () => {
    if (!contactInfo) return;
    
    const bookingDetails: BookingNotificationDetails = {
      customerName: contactInfo.name,
      customerEmail: contactInfo.email,
      customerPhone: contactInfo.phone,
      carModel: car.model,
      carTitle: car.title,
      startDate: format(startDate, 'dd MMM yyyy'),
      endDate: format(endDate, 'dd MMM yyyy'),
      numDays,
      tokenAmount,
      totalAmount,
      paymentMethod,
      paymentId
    };
    
    await generateBookingReceipt(bookingDetails);
  };
  
  const handleWhatsAppSupport = () => {
    // Basic WhatsApp support link
    const message = encodeURIComponent(
      `Hello, I've just booked a ${car.model} ${car.title} (Booking Reference: ${paymentId || 'Pending'}). I have a question about my booking.`
    );
    const supportNumber = "+919876543210"; // Replace with actual support number
    window.open(`https://api.whatsapp.com/send?phone=${supportNumber}&text=${message}`, '_blank');
  };
  
  return (
    <div className="step-container space-y-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h3 className="text-2xl font-bold">Booking Confirmed!</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Your booking has been successfully confirmed. Thank you for choosing Future Ride.
        </p>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
        <h4 className="font-medium text-lg mb-4">Booking Summary</h4>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <img src={car.image} alt={car.title} className="w-20 h-20 object-contain" />
            <div>
              <h5 className="font-medium">{car.model} {car.title}</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">{format(startDate, 'dd MMM yyyy')} - {format(endDate, 'dd MMM yyyy')}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Duration:</span>
              <span>{numDays} {numDays === 1 ? 'day' : 'days'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Daily rate:</span>
              <span>₹{car.pricePerDay.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Included kilometers:</span>
              <span>{baseKm} km/day</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Extra km rate:</span>
              <span>₹{pricePerKm}/km</span>
            </div>
            <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
              <span>Token amount paid:</span>
              <span>₹{tokenAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>Balance due at pickup:</span>
              <span>₹{(totalAmount - tokenAmount).toLocaleString()}</span>
            </div>
          </div>
          
          {paymentId && (
            <div className="text-sm text-gray-500 dark:text-gray-400 pt-2">
              Payment ID: {paymentId}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleDownloadReceipt}
        >
          <Download className="h-4 w-4" />
          Download Receipt
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleWhatsAppSupport}
        >
          <WhatsApp className="h-4 w-4" />
          WhatsApp Support
        </Button>
        
        <Button onClick={onFinish}>
          View My Bookings
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
