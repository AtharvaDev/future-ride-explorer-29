
import React from 'react';
import { format } from 'date-fns';
import { Car } from '@/data/cars';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Check, Info, Share2 } from 'lucide-react';
import { openWhatsAppWithBookingDetails } from '@/services/notificationService';

interface ConfirmationStepProps {
  car: Car;
  startDate: Date;
  endDate: Date;
  numDays: number;
  tokenAmount: number;
  totalAmount: number;
  baseKm?: number;
  pricePerKm?: number;
  onFinish: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  car,
  startDate,
  endDate,
  numDays,
  tokenAmount,
  totalAmount,
  baseKm = 200,
  pricePerKm,
  onFinish,
}) => {
  const handleShareViaWhatsApp = () => {
    const bookingDetails = {
      customerName: "You", // This is for customer sharing, so we use "You"
      carModel: car.model,
      carTitle: car.title,
      startDate: format(startDate, 'PPP'),
      endDate: format(endDate, 'PPP'),
      numDays,
      tokenAmount,
      totalAmount,
      customerPhone: "" // We don't include phone number when customer is sharing
    };
    
    openWhatsAppWithBookingDetails(bookingDetails);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
          <Check className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Thank you for booking with us. Your car is reserved.
        </p>
      </div>
      
      <Card className="p-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div className="font-medium">Car Details</div>
            <div>{car.model} {car.title}</div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="font-medium">Pick-up Date</div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-primary" />
              {format(startDate, 'PPP')}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="font-medium">Return Date</div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-primary" />
              {format(endDate, 'PPP')}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="font-medium">Duration</div>
            <div>{numDays} {numDays === 1 ? 'day' : 'days'}</div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="font-medium">Daily Rate</div>
            <div>₹{car.pricePerDay.toLocaleString()}</div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="font-medium">Booking Amount (Paid)</div>
            <div className="text-green-600 font-medium">₹{tokenAmount.toLocaleString()}</div>
          </div>
          
          <div className="flex justify-between items-center border-t pt-3">
            <div className="font-bold">Total Estimated Cost</div>
            <div className="font-bold text-lg">₹{totalAmount.toLocaleString()}</div>
          </div>
        </div>
      </Card>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex">
        <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5 mr-3" />
        <div>
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            <span className="font-medium">Important Information:</span> Your booking includes {baseKm} km per day. 
            Additional kilometers will be charged at ₹{pricePerKm}/km. The remaining balance (₹{(totalAmount - tokenAmount).toLocaleString()}) 
            will be collected on delivery.
          </p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-center gap-4 pt-2">
        <Button onClick={onFinish} className="w-full md:w-auto">
          View My Bookings
        </Button>
        <Button 
          onClick={handleShareViaWhatsApp} 
          variant="outline" 
          className="w-full md:w-auto flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share via WhatsApp
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
