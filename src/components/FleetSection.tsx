import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from '@/data/cars';
import { Card, CardContent } from '@/components/ui/card';
import gsap from 'gsap';
import { createRepeatingScrollAnimation } from '@/utils/scroll-animations';
import CarSection from './CarSection';

interface FleetSectionProps {
  cars: Car[];
}

const FleetSection: React.FC<FleetSectionProps> = ({ cars }) => {
  const navigate = useNavigate();
  const fleetGridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Set initial opacity to 0 for all cards
    cardRefs.current.forEach(card => {
      if (card) gsap.set(card, { opacity: 0, y: 30 });
    });

    // Create staggered animations for the cards
    if (fleetGridRef.current && cardRefs.current.length > 0) {
      const elements = cardRefs.current.filter(el => el !== null) as Element[];
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = cardRefs.current.findIndex(ref => ref === entry.target);
              
              gsap.to(entry.target, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: index * 0.1 % 0.6, // Stagger effect but reset after every 6 items
                ease: "power2.out"
              });
              
              // Keep observing to trigger animation when scrolling in and out
              // of the viewport for repeating animations
            }
            else {
              gsap.to(entry.target, {
                opacity: 0,
                y: 30,
                duration: 0.6,
                ease: "power2.in"
              });
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -100px 0px"
        }
      );
      
      elements.forEach(card => {
        observer.observe(card);
      });
      
      return () => {
        elements.forEach(card => {
          observer.unobserve(card);
        });
      };
    }
  }, []);

  const handleCarClick = (carId: string) => {
    navigate(`/booking/${carId}`);
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/30" id="fleet">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div 
            className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            data-scroll="fadeIn"
            data-duration="0.6"
          >
            Our Fleet
          </div>
          <h2 
            className="text-4xl font-bold mb-4"
            data-scroll="fadeUp"
            data-duration="0.7"
            data-delay="0.1"
          >
            Discover the Toyota range
          </h2>
          <p 
            className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            data-scroll="fadeUp"
            data-duration="0.7"
            data-delay="0.2"
          >
            Explore our diverse lineup of Toyota vehicles, from practical hatchbacks to luxurious SUVs
          </p>
        </div>
        
        <div 
          ref={fleetGridRef}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8"
        >
          {cars.map((car, index) => (
            <div>
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
            <Card 
              key={car.id} 
              ref={el => cardRefs.current[index] = el}
              className="overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => handleCarClick(car.id)}
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
                <img 
                  src={car.image} 
                  alt={car.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: car.color }}></span>
                    <span className="text-white text-sm font-medium">Learn more</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-bold mb-1">{car.title.split(' ').slice(1).join(' ')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{car.model}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">From</p>
                    <p className="text-lg font-bold">₹{car.pricePerKm}/km</p>
                  </div>
                  <div className="flex items-center gap-1 text-primary group-hover:translate-x-1 transition-transform duration-300">
                    <span className="text-sm font-medium">View details</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.33325 8H12.6666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 3.33337L12.6667 8.00004L8 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FleetSection;
