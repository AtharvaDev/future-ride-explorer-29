
import { useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CarSection from '@/components/CarSection';
import FleetSection from '@/components/FleetSection'; // Add import for the new component
import Footer from '@/components/Footer';
import { cars } from '@/data/cars';
import { initPageAnimations } from '@/utils/animations';
import { initScrollAnimations } from '@/utils/scroll-animations';
import gsap from 'gsap';

const Index = () => {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize all animations
    initPageAnimations();
    
    // Initialize scroll-triggered animations
    initScrollAnimations();
    
    // Animate the fleet section header when it comes into view
    if (headerRef.current) {
      gsap.set(headerRef.current, { opacity: 0, y: 30 });
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.to(headerRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
              });
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
        }
      );
      
      observer.observe(headerRef.current);
      
      return () => {
        if (headerRef.current) {
          observer.unobserve(headerRef.current);
        }
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <Hero />
      
      {/* Add FleetSection here before the individual CarSections */}
      <FleetSection cars={cars} />
      
      <div id="fleet-details" className="py-20 bg-gray-50 dark:bg-gray-900/30">
        <div ref={headerRef} className="container mx-auto px-4 text-center mb-16">
          <div 
            className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            data-scroll="fadeIn"
            data-duration="0.6"
          >
            Premium Fleet
          </div>
          <h2 
            className="text-4xl font-bold mb-4"
            data-scroll="fadeUp"
            data-duration="0.7"
            data-delay="0.1"
          >
            Discover Our Exceptional Vehicles
          </h2>
          <p 
            className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            data-scroll="fadeUp"
            data-duration="0.7"
            data-delay="0.2"
          >
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
      
      <div id="contact" className="py-20">
        {/* Contact section content */}
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
