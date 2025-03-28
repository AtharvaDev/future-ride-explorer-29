
import React from 'react';
import { format } from "date-fns";
import { BookOpen, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { Car } from '@/data/cars';

interface BookingDetails {
  contact?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  payment?: {
    method: string;
    details: string;
    amount: number;
    transactionId: string;
  };
}

interface ConfirmationStepProps {
  car: Car;
  startDate: Date;
  endDate: Date;
  numDays: number;  // Changed from numberOfDays to numDays
  totalAmount: number;  // Changed from totalCost to totalAmount
  tokenAmount: number;
  onFinish: () => void;
  bookingDetails?: BookingDetails;
  onDownloadReceipt?: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  bookingDetails,
  car,
  startDate,
  endDate,
  numDays,
  totalAmount,
  tokenAmount,
  onFinish,
  onDownloadReceipt
}) => {
  const navigate = useNavigate();

  // Generate booking reference
  const generateBookingReference = () => {
    const prefix = car.model.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().substring(7);
    return `${prefix}${timestamp}`;
  };
  
  // Generate a fake transaction ID if not provided
  const transactionId = bookingDetails?.payment?.transactionId || 
    `TXN${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  return (
    <div className="step-container space-y-6">
      <div className="text-center mb-6">
        <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-2xl font-bold">Booking Confirmed!</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Your booking has been successfully confirmed. Below is your booking receipt.
        </p>
      </div>
      
      <div className="glass-panel p-6 rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-lg font-bold">FutureRide</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Premium Car Rental Service</p>
          </div>
          <Badge className="text-xs">Receipt</Badge>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Booking Reference:</span>
            <span className="font-medium">{generateBookingReference()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Transaction ID:</span>
            <span className="font-medium">{transactionId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Payment Method:</span>
            <span>UPI - {bookingDetails?.payment?.details || "Payment completed"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Payment Date:</span>
            <span>{format(new Date(), "PPP")}</span>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Vehicle:</span>
            <span>{car.model} {car.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Pickup Date:</span>
            <span>{startDate ? format(startDate, "PPP") : "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Return Date:</span>
            <span>{endDate ? format(endDate, "PPP") : "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Duration:</span>
            <span>{numDays} {numDays === 1 ? 'day' : 'days'}</span>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Daily Rate:</span>
            <span>₹{car.pricePerDay.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Token Amount Paid:</span>
            <span className="font-medium">₹{tokenAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total Amount:</span>
            <span>₹{totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Balance Due at Pickup:</span>
            <span>₹{(totalAmount - tokenAmount).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between">
          {onDownloadReceipt && (
            <Button variant="outline" className="download-btn flex items-center gap-2" onClick={onDownloadReceipt}>
              <BookOpen className="h-4 w-4" />
              Download Receipt
            </Button>
          )}
          <Button 
            onClick={onFinish}
            className="flex items-center gap-2"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;
