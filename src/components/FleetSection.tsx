import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from '@/data/cars';
import gsap from 'gsap';
import CarCard from './fleet/CarCard';
import VideoDialog from './fleet/VideoDialog';

interface FleetSectionProps {
  cars: Car[];
}

const FleetSection: React.FC<FleetSectionProps> = ({ cars }) => {
  const navigate = useNavigate();
  const fleetGridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    // Clean up timer when component unmounts
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Handle actual redirection after video plays
    if (videoOpen && selectedCar && selectedCar.video) {
      // Clear any existing timer
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
      
      // Set a new timer to redirect after 5 seconds
      redirectTimerRef.current = setTimeout(() => {
        setVideoOpen(false);
        navigate(`/booking/${selectedCar.id}`);
      }, 5000);
    }
    
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, [videoOpen, selectedCar, navigate]);

  const handleCarClick = (car: Car) => {
    if (car.video) {
      // Only show video if car has a video URL
      setSelectedCar(car);
      setVideoOpen(true);
    } else {
      // If there's no video, navigate directly
      navigate(`/booking/${car.id}`);
    }
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
            <div key={car.id}>
              <CarCard
                ref={el => cardRefs.current[index] = el}
                car={car}
                onCardClick={handleCarClick}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Video Dialog */}
      <VideoDialog
        car={selectedCar}
        open={videoOpen}
        onOpenChange={setVideoOpen}
        onVideoComplete={() => {
          if (selectedCar) {
            navigate(`/booking/${selectedCar.id}`);
          }
        }}
      />
    </section>
  );
};

export default FleetSection;
