
import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format, addDays } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cars } from '@/data/cars';
import { Car } from 'lucide-react';

interface DateSelectorProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  selectedCar: string;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  setSelectedCar: (carId: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  startDate,
  endDate,
  selectedCar,
  setStartDate,
  setEndDate,
  setSelectedCar,
}) => {
  return (
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
  );
};

export default DateSelector;
