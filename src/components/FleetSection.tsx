import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from '@/data/cars';
import gsap from 'gsap';
import CarCard from './fleet/CarCard';
import VideoDialog from './fleet/VideoDialog';
import { videoConfig } from '@/config/videoConfig';

interface FleetSectionProps {
  cars: Car[];
}

const FleetSection: React.FC<FleetSectionProps> = ({ cars }) => {
  const navigate = useNavigate();
  const fleetGridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    // Set initial opacity to 0 for all cards and the section title
    cardRefs.current.forEach(card => {
      if (card) gsap.set(card, { opacity: 0, y: 50, scale: 0.95 });
    });
    
    if (headerRef.current) {
      gsap.set(headerRef.current, { opacity: 0, y: 30 });
    }

    // Create staggered animations for the cards
    if (fleetGridRef.current && cardRefs.current.length > 0) {
      const elements = cardRefs.current.filter(el => el !== null) as Element[];
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // If entry is the header element
              if (entry.target === headerRef.current) {
                gsap.to(entry.target, {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  ease: "back.out(1.2)"
                });
                return;
              }
              
              const index = cardRefs.current.findIndex(ref => ref === entry.target);
              
              // Create a timeline for each card with multiple animations
              const tl = gsap.timeline();
              
              tl.to(entry.target, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: index * 0.1 % 0.6, // Stagger effect but reset after every 6 items
                ease: "power3.out"
              });
              
              tl.to(entry.target, {
                scale: 1,
                duration: 0.4,
                ease: "back.out(1.7)"
              }, "-=0.4");
              
              // Add a subtle bounce effect
              tl.to(entry.target, {
                y: -8,
                duration: 0.3,
                ease: "power1.out"
              }, "-=0.1");
              
              tl.to(entry.target, {
                y: 0,
                duration: 0.2,
                ease: "power1.in"
              });
            }
            else {
              gsap.to(entry.target, {
                opacity: 0,
                y: 30,
                scale: 0.95,
                duration: 0.6,
                ease: "power2.in"
              });
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: "0px 0px -100px 0px"
        }
      );
      
      // Observe all card elements
      elements.forEach(card => {
        observer.observe(card);
      });
      
      // Also observe the header element
      if (headerRef.current) {
        observer.observe(headerRef.current);
      }
      
      return () => {
        elements.forEach(card => {
          observer.unobserve(card);
        });
        if (headerRef.current) {
          observer.unobserve(headerRef.current);
        }
      };
    }
  }, []);

  useEffect(() => {
    // Animate background pattern on section when it's in viewport
    if (sectionRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            gsap.to(sectionRef.current, {
              backgroundPosition: '100% 100%',
              duration: 15,
              ease: "none",
              repeat: -1,
              yoyo: true
            });
          } else {
            gsap.killTweensOf(sectionRef.current);
          }
        },
        { threshold: 0.1 }
      );
      
      observer.observe(sectionRef.current);
      return () => {
        if (sectionRef.current) observer.unobserve(sectionRef.current);
      };
    }
  }, []);

  // Floating animation for hovered card
  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredCard = cardRefs.current[hoveredIndex];
      if (hoveredCard) {
        gsap.to(hoveredCard, {
          y: -10,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          duration: 0.4,
          ease: "power2.out"
        });
      }
    }
  }, [hoveredIndex]);

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
      
      // Set a new timer to redirect after configured delay
      redirectTimerRef.current = setTimeout(() => {
        setVideoOpen(false);
        navigate(`/booking/${selectedCar.id}`);
      }, videoConfig.autoSkipDelay);
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
    <section 
      ref={sectionRef}
      className="py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-900/50" 
      id="fleet"
      style={{
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(145, 100, 255, 0.05) 0%, rgba(131, 100, 255, 0.01) 40%)',
        backgroundSize: '200% 200%',
        backgroundPosition: '0% 0%'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12" ref={headerRef}>
          <div 
            className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 relative"
            style={{ overflow: 'hidden' }}
          >
            <span className="relative z-10">Our Fleet</span>
            <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
          </div>
          <h2 
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600"
          >
            Discover the Premium range
          </h2>
          <p 
            className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Explore our diverse lineup of Best vehicles, from practical hatchbacks to luxurious SUVs
          </p>
          
          {/* Decorative elements */}
          <div className="relative h-8 w-full my-6">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-1">
              <div className="absolute w-1/3 h-full left-0 bg-gradient-to-r from-transparent to-purple-400"></div>
              <div className="absolute w-1/3 h-full left-1/3 bg-purple-500"></div>
              <div className="absolute w-1/3 h-full right-0 bg-gradient-to-r from-indigo-500 to-transparent"></div>
            </div>
          </div>
        </div>
        
        <div 
          ref={fleetGridRef}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8"
        >
          {cars.map((car, index) => (
            <div 
              key={car.id}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
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
