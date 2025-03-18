
import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Car, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays, differenceInDays } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cars } from '@/data/cars';

const BookingSection = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [selectedCar, setSelectedCar] = useState(cars[0].id);
  const [totalCost, setTotalCost] = useState(1000);

  // Calculate the total cost based on selected dates and car
  useEffect(() => {
    const days = startDate && endDate ? Math.max(differenceInDays(endDate, startDate) + 1, 1) : 1;
    setNumberOfDays(days);
    
    const car = cars.find(car => car.id === selectedCar);
    if (car) {
      setTotalCost(car.pricePerDay * days);
    }
  }, [startDate, endDate, selectedCar]);

  const selectedCarData = cars.find(car => car.id === selectedCar) || cars[0];

  return (
    <div id="booking" className="min-h-screen py-24 relative flex items-center bg-gradient-to-b from-background to-gray-50 dark:from-background dark:to-gray-900/30">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552244461-9ed4fe0328a1')] bg-cover bg-fixed bg-center opacity-5"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">RESERVATION</Badge>
          <h2 className="text-4xl font-bold mb-4">Book Your Next Journey</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Reserve your premium vehicle with just a few clicks and start your journey towards the future of transportation.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="glass-panel rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Select Your Dates</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pickup Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {startDate ? (
                            format(startDate, "PPP")
                          ) : (
                            <span>Select pickup date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => {
                            setStartDate(date);
                            if (date && endDate && date > endDate) {
                              setEndDate(addDays(date, 1));
                            }
                          }}
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
                          disabled={!startDate}
                        >
                          {endDate ? (
                            format(endDate, "PPP")
                          ) : (
                            <span>Select return date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) => date < (startDate || new Date())}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Vehicle</label>
                    <Select value={selectedCar} onValueChange={setSelectedCar}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {cars.map((car) => (
                          <SelectItem key={car.id} value={car.id}>
                            <div className="flex items-center gap-2">
                              <Car className="h-4 w-4" />
                              <span>{car.model} {car.title}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
                
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
                    <Button className="w-full" size="lg">
                      Confirm Booking
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Free cancellation up to 24 hours before pickup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSection;
