
import { useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FleetSection from '@/components/FleetSection';
import Footer from '@/components/Footer';
import { initPageAnimations } from '@/utils/animations';
import { initScrollAnimations } from '@/utils/scroll-animations';
import { useQuery } from '@tanstack/react-query';
import { getAllCars } from '@/services/carService';
import { Loader } from 'lucide-react';

const Index = () => {
  // Fetch cars from Firestore
  const { data: cars = [], isLoading, isError } = useQuery({
    queryKey: ['cars'],
    queryFn: getAllCars
  });

  useEffect(() => {
    // Initialize all animations
    initPageAnimations();
    
    // Initialize scroll-triggered animations
    initScrollAnimations();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="h-12 w-12 animate-spin text-primary" />
          <p>Loading car information...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
          <p className="mb-6">There was an error loading car data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <Hero />
      
      {/* Show FleetSection with cars from Firestore */}
      <FleetSection cars={cars} />
      
      <div id="contact" className="py-20">
        {/* Contact section content */}
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
