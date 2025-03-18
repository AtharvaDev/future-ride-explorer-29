
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CarSection from '@/components/CarSection';
import BookingSection from '@/components/BookingSection';
import Footer from '@/components/Footer';
import { cars } from '@/data/cars';
import { setupScrollAnimations } from '@/utils/scroll-observer';

const Index = () => {
  const [showBooking, setShowBooking] = useState(false);
  
  useEffect(() => {
    // Set up scroll animations when component mounts
    const cleanupAnimations = setupScrollAnimations();
    
    // Show booking section when hash changes or when custom event is triggered
    const handleHashChange = () => {
      if (window.location.hash === '#booking') {
        setShowBooking(true);
      }
    };
    
    // Listen for the custom event from the Book Now button
    const handleShowBooking = () => {
      setShowBooking(true);
    };
    
    // Check initial hash
    handleHashChange();
    
    // Add event listeners
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('showBookingSection', handleShowBooking);
    
    // Clean up event listeners when component unmounts
    return () => {
      cleanupAnimations();
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('showBookingSection', handleShowBooking);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <Hero />
      
      <div className="py-20 bg-gray-50 dark:bg-gray-900/30">
        <div className="container mx-auto px-4 text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Premium Fleet
          </div>
          <h2 className="text-4xl font-bold mb-4">Discover Our Exceptional Vehicles</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Browse through our collection of cutting-edge vehicles offering unparalleled comfort, performance, and technology.
          </p>
        </div>
      </div>
      
      {cars.map((car, index) => (
        <CarSection
          key={car.id}
          id={car.id}
          model={car.model}
          title={car.title}
          description={car.description}
          pricePerDay={car.pricePerDay}
          pricePerKm={car.pricePerKm}
          image={car.image}
          color={car.color}
          features={car.features}
          index={index}
        />
      ))}
      
      {showBooking && <BookingSection />}
      
      <Footer />
    </div>
  );
};

export default Index;
