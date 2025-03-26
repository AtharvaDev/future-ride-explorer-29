import { useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CarSection from '@/components/CarSection';
import FleetSection from '@/components/FleetSection';
import Footer from '@/components/Footer';
import { cars } from '@/data/cars';
import { initPageAnimations } from '@/utils/animations';
import { initScrollAnimations } from '@/utils/scroll-animations';

const Index = () => {
  useEffect(() => {
    // Initialize all animations
    initPageAnimations();
    
    // Initialize scroll-triggered animations
    initScrollAnimations();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <Hero />
      
      {/* Add FleetSection here before the individual CarSections */}
      <FleetSection cars={cars} />
      
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
      
      <div id="contact" className="py-20">
        {/* Contact section content */}
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
