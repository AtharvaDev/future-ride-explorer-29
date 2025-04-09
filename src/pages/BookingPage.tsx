
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { gsap } from '@/lib/gsap';
import { Card } from '@/components/ui/card';
import CarSection from '@/components/CarSection';
import VideoDialog from '@/components/fleet/VideoDialog';
import { Loader } from 'lucide-react';
import { getAllCars } from '@/services/carService';
import { useQuery } from '@tanstack/react-query';
import BookingPageContainer from '@/components/booking/BookingPageContainer';
import { fadeInUp, fadeInLeft, fadeInRight, scaleIn } from '@/utils/animations';

const BookingPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [videoOpen, setVideoOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  const { data: cars = [], isLoading: carsLoading, error: carsError } = useQuery({
    queryKey: ['cars'],
    queryFn: getAllCars
  });

  const selectedCar = carId 
    ? cars.find(car => car.id === carId) || (cars.length > 0 ? cars[0] : null)
    : cars.length > 0 ? cars[0] : null;

  // Handle initial page load and animations
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Short timeout to ensure DOM elements are ready
    const timer = setTimeout(() => {
      setPageReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Handle car selection and navigation
  useEffect(() => {
    if (carId && cars.length > 0 && !cars.find(car => car.id === carId)) {
      toast.error("Car not found, redirecting to default options");
      if (cars.length > 0) {
        navigate(`/booking/${cars[0].id}`);
      }
    }
  }, [carId, cars, navigate]);

  // Error display when car data validation fails
  useEffect(() => {
    if (carsError) {
      const errorMessage = carsError instanceof Error ? carsError.message : 'Unknown error loading cars';
      toast.error(errorMessage);
      console.error('Cars loading error:', carsError);
    }
  }, [carsError]);

  // Initialize page animations when all content is ready
  useEffect(() => {
    if (pageReady && selectedCar && !carsLoading && pageRef.current) {
      // Create a master timeline for coordinated animations
      const masterTl = gsap.timeline();
      
      // Animate the page entry
      masterTl.add(() => {
        if (headerRef.current) {
          fadeInUp(headerRef.current, 0.2, 0.8);
        }
      });
      
      // Animate the main container with a subtle reveal
      masterTl.add(() => {
        if (mainContainerRef.current) {
          // Create a parallax scroll effect
          gsap.set(mainContainerRef.current, { y: 40, opacity: 0 });
          gsap.to(mainContainerRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "all"
          });
        }
      }, "-=0.6");
      
      // Add scroll-triggered animations
      if (pageRef.current) {
        const sections = pageRef.current.querySelectorAll('.animate-on-scroll');
        sections.forEach((section, index) => {
          gsap.from(section, {
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none none"
            },
            y: 40,
            opacity: 0,
            duration: 0.7,
            delay: index * 0.1,
            ease: "power2.out"
          });
        });
      }

      return () => {
        // Clean up all animations and scroll triggers
        masterTl.kill();
        if (pageRef.current) {
          gsap.killTweensOf(pageRef.current.querySelectorAll('.animate-on-scroll'));
        }
      };
    }
  }, [pageReady, selectedCar, carsLoading]);

  const handleWatchVideo = () => {
    if (selectedCar?.video) {
      setLoading(true);
      setVideoOpen(true);
      
      // Add animation to video loading
      const loadingAnimation = gsap.timeline({ repeat: -1 });
      loadingAnimation.to(".video-loading-animation", { 
        rotate: 360, 
        duration: 1.5, 
        ease: "power1.inOut" 
      });
      
      setTimeout(() => {
        setLoading(false);
        loadingAnimation.kill();
      }, 1500);
    }
  };

  // Handle video dialog closing
  const handleVideoComplete = () => {
    setVideoOpen(false);
    
    // Create a re-entry animation
    if (mainContainerRef.current) {
      gsap.from(mainContainerRef.current, {
        opacity: 0.7,
        scale: 0.98,
        duration: 0.6,
        ease: "power2.out"
      });
    }
  };

  if (carsLoading || !selectedCar) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader className="h-12 w-12 animate-spin text-primary video-loading-animation" />
            <p className="animate-pulse">Loading car data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background" ref={pageRef}>
      <Navbar />
      
      <div className="animate-on-scroll">
        <Card>
          <CarSection
            key={selectedCar.id}
            id={selectedCar.id}
            model={selectedCar.model}
            title={selectedCar.title}
            description={selectedCar.description || ''}
            pricePerDay={selectedCar.pricePerDay}
            pricePerKm={selectedCar.pricePerKm || 0}
            image={selectedCar.image}
            color={selectedCar.color || '#000000'}
            features={selectedCar.features || []}
            index={carId || "0"}
          />
        </Card>
      </div>
      
      <main className="flex-grow" ref={mainContainerRef}>
        <h1 
          ref={headerRef} 
          className="text-3xl md:text-4xl font-bold my-8 text-center page-title"
        >
          Complete Your Booking
        </h1>
        
        <BookingPageContainer 
          selectedCar={selectedCar}
          onWatchVideo={handleWatchVideo}
        />
      </main>

      {selectedCar.video && (
        <VideoDialog
          car={selectedCar}
          open={videoOpen}
          onOpenChange={setVideoOpen}
          onVideoComplete={handleVideoComplete}
        />
      )}

      <Footer />
    </div>
  );
};

export default BookingPage;
