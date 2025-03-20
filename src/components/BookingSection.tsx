
import React, { useState, useEffect, useRef } from 'react';
import { Badge } from "@/components/ui/badge";
import { differenceInDays } from "date-fns";
import { cars } from '@/data/cars';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import DateSelector from './booking/DateSelector';
import BookingSummary from './booking/BookingSummary';

const BookingSection = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [selectedCar, setSelectedCar] = useState(cars[0].id);
  const [totalCost, setTotalCost] = useState(1000);
  const [isVisible, setIsVisible] = useState(false);
  const bookingSectionRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Check if there's a hash in the URL
  useEffect(() => {
    const showBookingFromHash = location.hash === '#booking';
    if (showBookingFromHash) {
      setIsVisible(true);
      // Scroll to booking section with animation after a short delay
      setTimeout(() => {
        bookingSectionRef.current?.scrollIntoView({
          behavior: 'smooth'
        });
      }, 300);
    }
  }, [location]);

  // Calculate the total cost based on selected dates and car
  useEffect(() => {
    const days = startDate && endDate ? Math.max(differenceInDays(endDate, startDate) + 1, 1) : 1;
    setNumberOfDays(days);
    
    const car = cars.find(car => car.id === selectedCar);
    if (car) {
      setTotalCost(car.pricePerDay * days);
    }
  }, [startDate, endDate, selectedCar]);

  // Animation when the booking section becomes visible
  useEffect(() => {
    if (isVisible && bookingSectionRef.current) {
      gsap.fromTo(
        bookingSectionRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [isVisible]);

  const selectedCarData = cars.find(car => car.id === selectedCar) || cars[0];

  // If section is not visible, don't render it
  if (!isVisible) {
    return null;
  }

  return (
    <div 
      id="booking" 
      ref={bookingSectionRef}
      className="min-h-screen py-24 relative flex items-center bg-gradient-to-b from-background to-gray-50 dark:from-background dark:to-gray-900/30"
    >
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
                <DateSelector 
                  startDate={startDate}
                  endDate={endDate}
                  selectedCar={selectedCar}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  setSelectedCar={setSelectedCar}
                />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
                <BookingSummary 
                  selectedCarData={selectedCarData}
                  numberOfDays={numberOfDays}
                  totalCost={totalCost}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSection;
