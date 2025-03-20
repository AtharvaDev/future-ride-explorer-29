
import React from 'react';
import { Car } from 'lucide-react';
import { Car as CarType } from '@/data/cars';
import { Check } from 'lucide-react';

interface BookingSummaryProps {
  selectedCarData: CarType;
  numberOfDays: number;
  totalCost: number;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  selectedCarData,
  numberOfDays,
  totalCost,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <img 
            src={selectedCarData.image} 
            alt={selectedCarData.title} 
            className="w-16 h-16 object-contain"
          />
          <div>
            <h4 className="font-medium">{selectedCarData.model} {selectedCarData.title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">₹{selectedCarData.pricePerDay}/day • ₹{selectedCarData.pricePerKm}/km</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Duration:</span>
            <span>{numberOfDays} {numberOfDays === 1 ? 'day' : 'days'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Daily rate:</span>
            <span>₹{selectedCarData.pricePerDay.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Token amount:</span>
            <span>₹1,000</span>
          </div>
          <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span>Total:</span>
            <span>₹{totalCost.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          * A token amount of ₹1,000 per day will be charged at the time of booking.
        </p>
        <button className="w-full rounded-lg px-6 py-3 bg-primary text-white font-medium transition-all hover:shadow-lg hover:bg-primary/90 hover:-translate-y-0.5 text-center">
          Confirm Booking
        </button>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <Check className="h-4 w-4 text-green-500" />
        <span>Free cancellation up to 24 hours before pickup</span>
      </div>
    </div>
  );
};

export default BookingSummary;
