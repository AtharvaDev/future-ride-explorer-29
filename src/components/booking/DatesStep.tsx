
import React from 'react';
import { ArrowLeft, CalendarIcon, ChevronRight } from "lucide-react";
import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Car } from '@/data/cars';
import { cn } from "@/lib/utils";

interface DatesStepProps {
  onSubmit: (data: { startDate: Date; endDate: Date }) => void;
  car?: Car;
  startDate?: Date;
  endDate?: Date;
  numberOfDays?: number;
  totalCost?: number;
  tokenAmount?: number;
  onStartDateChange?: (date: Date | undefined) => void;
  onEndDateChange?: (date: Date | undefined) => void;
  onNext?: () => void;
  onBack?: () => void;
}

const DatesStep: React.FC<DatesStepProps> = ({
  car,
  startDate,
  endDate,
  numberOfDays = 0,
  totalCost = 0,
  tokenAmount = 0,
  onStartDateChange,
  onEndDateChange,
  onSubmit,
  onNext,
  onBack
}) => {
  // Simple form for onSubmit pattern if no start/end date handlers provided
  const [localStartDate, setLocalStartDate] = React.useState<Date | undefined>(startDate);
  const [localEndDate, setLocalEndDate] = React.useState<Date | undefined>(endDate);

  const handleStartDateChange = (date: Date | undefined) => {
    if (onStartDateChange) {
      onStartDateChange(date);
    } else {
      setLocalStartDate(date);
      // If new start date is after end date, reset end date
      if (date && localEndDate && date > localEndDate) {
        setLocalEndDate(addDays(date, 1));
      }
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (onEndDateChange) {
      onEndDateChange(date);
    } else {
      setLocalEndDate(date);
    }
  };

  const handleSubmit = () => {
    if (localStartDate && localEndDate) {
      onSubmit({ startDate: localStartDate, endDate: localEndDate });
    }
  };

  return (
    <div className="step-container space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Select Dates</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Please select your pickup and return dates.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Pickup Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {localStartDate ? (
                    format(localStartDate, "PPP")
                  ) : (
                    <span>Select pickup date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={localStartDate}
                  onSelect={handleStartDateChange}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Return Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  disabled={!localStartDate}
                >
                  {localEndDate ? (
                    format(localEndDate, "PPP")
                  ) : (
                    <span>Select return date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={localEndDate}
                  onSelect={handleEndDateChange}
                  disabled={(date) => date < (localStartDate || new Date())}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {car && (
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Booking Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Duration:</span>
                <span>{numberOfDays} {numberOfDays === 1 ? 'day' : 'days'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Daily rate:</span>
                <span>₹{car.pricePerDay.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Includes:</span>
                <span>200 km/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Extra km rate:</span>
                <span>₹{car.pricePerKm}/km</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Token amount:</span>
                <span>₹{tokenAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>Total:</span>
                <span>₹{totalCost.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              * A token amount of ₹1,000 is required to confirm your booking.
            </p>
          </div>
        )}
      </div>
      
      <div className="flex justify-between pt-4">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        )}
        
        <Button 
          onClick={onNext || handleSubmit}
          disabled={!localStartDate || !localEndDate}
        >
          Continue to Contact
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default DatesStep;
