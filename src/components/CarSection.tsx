
import React, { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { fadeInLeft, fadeInRight, createHoverAnimation } from '@/utils/animations';

interface CarFeature {
  icon: string;
  title: string;
  description: string;
}

interface CarSectionProps {
  id: string;
  model: string;
  title: string;
  description: string;
  pricePerDay: number;
  pricePerKm: number;
  image: string;
  color: string;
  features: CarFeature[];
  index: number;
}

const CarSection: React.FC<CarSectionProps> = ({
  id,
  model,
  title,
  description,
  pricePerDay,
  pricePerKm,
  image,
  color,
  features,
  index,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carImageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const isEven = index % 2 === 0;

  useEffect(() => {
    // Set initial states for animations
    gsap.set([carImageRef.current, contentRef.current], { opacity: 0 });
    featureRefs.current.forEach(el => el && gsap.set(el, { opacity: 0, y: 20 }));
    
    // Intersection Observer for scroll-triggered animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate car image and content when they come into view
            if (carImageRef.current) {
              gsap.to(carImageRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "power2.out",
                clearProps: "all"
              });
            }
            
            if (contentRef.current) {
              if (isEven) {
                fadeInLeft(contentRef.current, 0.3);
              } else {
                fadeInRight(contentRef.current, 0.3);
              }
            }
            
            // Stagger animation for features
            featureRefs.current.forEach((el, i) => {
              if (el) {
                gsap.to(el, {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  delay: 0.4 + (i * 0.1),
                  ease: "power2.out"
                });
              }
            });
            
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: '-10% 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Add hover animation to button
    let buttonCleanup: (() => void) | null = null;
    if (buttonRef.current) {
      buttonCleanup = createHoverAnimation(buttonRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      if (buttonCleanup) {
        buttonCleanup();
      }
    };
  }, [isEven]);

  const handleBookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/booking/${id}`);
  };

  return (
    <div
      id={id}
      ref={sectionRef}
      className="car-section"
    >
      <div 
        className={cn("container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center",
          isEven ? "md:grid-flow-row" : "md:grid-flow-row-dense"
        )}
      >
        <div 
          className={cn(
            "relative z-10 flex justify-center items-center col-span-1",
            isEven ? "md:order-1" : "md:order-2"
          )}
        >
          <div className="relative w-full max-w-xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-xl rounded-full animate-pulse-light"></div>
            <img
              ref={carImageRef}
              src={image}
              alt={`${model} ${title}`}
              className="relative z-10 w-full h-auto object-contain transition-all duration-1000"
              style={{ transform: 'scale(0.92)' }}
            />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-12 bg-black/10 blur-xl rounded-full"></div>
          </div>
        </div>

        <div 
          ref={contentRef}
          className={cn(
            "col-span-1 transition-all duration-1000 max-w-lg",
            isEven ? "md:order-2" : "md:order-1",
            isEven ? "md:justify-self-start" : "md:justify-self-end"
          )}
        >
          <div className="badge inline-block mb-4 px-3 py-1 rounded-full" style={{ backgroundColor: `${color}20`, color: color }}>
            <span className="text-sm font-medium">{model}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {features.slice(0, 4).map((feature, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-2"
                ref={el => featureRefs.current[idx] = el}
              >
                <div className="flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{feature.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Starting at</p>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold">₹{pricePerDay}</span>
                <span className="text-gray-500 dark:text-gray-400 mb-1">/day</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">₹{pricePerKm}/km mileage fee</p>
            </div>
            <button 
              ref={buttonRef}
              className="rounded-lg px-6 py-3 bg-primary text-white font-medium transition-all duration-300 hover:shadow-lg hover:bg-primary/90 text-center"
              onClick={handleBookNow}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarSection;
