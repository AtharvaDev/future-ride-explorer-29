
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays } from 'date-fns';
import { ArrowRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BookingFormState } from '@/hooks/useBookingFormState';

interface DatesStepProps {
  formState: BookingFormState;
  bookingSummary: {
    totalDays: number;
    dailyRate: number;
    subtotal: number;
    totalAmount: number;
    tokenAmount: number;
    baseKm: number;
    extraKmRate: number;
  };
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
  onNext: () => void;
  onBack?: () => void;
}

const DatesStep: React.FC<DatesStepProps> = ({
  formState,
  bookingSummary,
  onDateChange,
  onNext,
  onBack,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(formState.startDate);
  const [endDate, setEndDate] = useState<Date | null>(formState.endDate);
  
  const minEndDate = startDate ? addDays(startDate, 1) : undefined;
  
  useEffect(() => {
    onDateChange(startDate, endDate);
  }, [startDate, endDate, onDateChange]);
  
  const handleStartDateSelect = (date: Date | null) => {
    setStartDate(date);
    
    if (date && endDate && endDate < date) {
      setEndDate(null);
    }
  };
  
  const handleEndDateSelect = (date: Date | null) => {
    setEndDate(date);
  };
  
  const isFormValid = startDate && endDate && formState.isDatesValid;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Select Trip Dates</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Choose your rental period
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate || undefined}
                        onSelect={handleStartDateSelect}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                        disabled={!startDate}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate || undefined}
                        onSelect={handleEndDateSelect}
                        disabled={(date) => 
                          date < (minEndDate || new Date())
                        }
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              {startDate && endDate && !formState.isDatesValid && (
                <div className="text-red-500 text-sm mt-2">
                  End date must be after start date.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Trip Summary</h3>
            
            {startDate && endDate && formState.isDatesValid ? (
              <div className="space-y-4">                
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Trip Dates</p>
                    <p className="font-medium">
                      {format(startDate, "MMM dd, yyyy")} - {format(endDate, "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                    <p className="font-medium">{bookingSummary.totalDays} days</p>
                  </div>
                </div>
                
                <div className="border-t my-2 pt-2">
                  <div className="flex justify-between my-1">
                    <p className="text-gray-500 dark:text-gray-400">Daily Rate</p>
                    <p>₹{bookingSummary.dailyRate}/day</p>
                  </div>
                  <div className="flex justify-between my-1">
                    <p className="text-gray-500 dark:text-gray-400">Subtotal ({bookingSummary.totalDays} days)</p>
                    <p>₹{bookingSummary.subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t mt-2">
                    <p>Total Amount</p>
                    <p>₹{bookingSummary.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between mt-2">
                    <p className="text-sm text-gray-500">Extra KM charges</p>
                    <p className="text-sm">₹{bookingSummary.extraKmRate}/km after {bookingSummary.baseKm} km</p>
                  </div>
                  <div className="flex justify-between mt-4 pt-2 border-t">
                    <p className="text-primary font-medium">Token Amount</p>
                    <p className="text-primary font-semibold">₹{bookingSummary.tokenAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-4">
                <p className="text-gray-500 dark:text-gray-400">
                  Select your dates to see the trip summary
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        <div className={onBack ? "" : "ml-auto"}>
          <Button 
            onClick={onNext} 
            disabled={!isFormValid}
            className="bg-primary text-white"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DatesStep;
