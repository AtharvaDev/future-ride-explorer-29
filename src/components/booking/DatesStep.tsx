import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays } from 'date-fns';
import { ArrowRight, Calendar as CalendarIcon, Clock, Map } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { BookingFormState } from '@/hooks/useBookingFormState';

interface DatesStepProps {
  formState: BookingFormState;
  bookingSummary: {
    totalDays: number;
    dailyRate: number;
    subtotal: number;
    tax: number;
    totalAmount: number;
    tokenAmount: number;
  };
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
  onCityChange: (city: string) => void;
  onNext: () => void;
  onBack?: () => void;
}

const CITIES = [
  "Bangalore",
  "Mumbai",
  "Delhi",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Kochi",
];

const DatesStep: React.FC<DatesStepProps> = ({
  formState,
  bookingSummary,
  onDateChange,
  onCityChange,
  onNext,
  onBack,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(formState.startDate);
  const [endDate, setEndDate] = useState<Date | null>(formState.endDate);
  const [city, setCity] = useState(formState.startCity);
  
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
  
  const handleCityChange = (value: string) => {
    setCity(value);
    onCityChange(value);
  };
  
  const isFormValid = startDate && endDate && city && formState.isDatesValid;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Select Trip Dates</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Choose your pickup location and rental period
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Pickup Location</label>
                <Select
                  value={city}
                  onValueChange={handleCityChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((cityName) => (
                      <SelectItem key={cityName} value={cityName}>{cityName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
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
                  <Map className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pickup Location</p>
                    <p className="font-medium">{city}</p>
                  </div>
                </div>
                
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
                    <p className="text-gray-500 dark:text-gray-400">Subtotal</p>
                    <p>₹{bookingSummary.subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between my-1">
                    <p className="text-gray-500 dark:text-gray-400">Tax (18%)</p>
                    <p>₹{bookingSummary.tax.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t mt-2">
                    <p>Total</p>
                    <p>₹{bookingSummary.totalAmount.toFixed(2)}</p>
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
