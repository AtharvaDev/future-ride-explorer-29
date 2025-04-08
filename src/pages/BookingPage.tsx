
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingForm from '@/components/BookingForm';
import { toast } from 'sonner';
import { gsap } from '@/lib/gsap';
import { Card } from '@/components/ui/card';
import CarSection from '@/components/CarSection';
import VideoDialog from '@/components/fleet/VideoDialog';
import CarImageCarousel from '@/components/fleet/CarImageCarousel';
import RentalInsights from '@/components/fleet/RentalInsights';
import { Button } from '@/components/ui/button';
import { Loader, Play } from 'lucide-react';
import { getAllCars } from '@/services/carService';
import { useQuery } from '@tanstack/react-query';
import { videoConfig } from '@/config/videoConfig';

const BookingPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [videoOpen, setVideoOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const bookingFormRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const { data: cars = [], isLoading: carsLoading } = useQuery({
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

  // Initialize animations after page and data are ready
  useEffect(() => {
    if (pageReady && selectedCar && !carsLoading) {
      const tl = gsap.timeline();
      
      // Clear any existing animations first
      gsap.set(['.page-title', '.car-details', '.booking-container'], { clearProps: "all" });
      
      // Start new animations
      tl.from('.page-title', {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      })
      .from('.car-details', {
        x: -100,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.4')
      .from('.booking-container', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.4');

      return () => {
        tl.kill();
      };
    }
  }, [pageReady, selectedCar, carsLoading]);

  const scrollToBookingForm = () => {
    if (bookingFormRef.current) {
      bookingFormRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleWatchVideo = () => {
    if (selectedCar?.video) {
      setLoading(true);
      setVideoOpen(true);
      
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  // Handle video dialog closing
  const handleVideoComplete = () => {
    setVideoOpen(false);
    // Ensure page animations run again after video closes
    setTimeout(() => {
      setPageReady(true);
    }, 300);
  };

  if (carsLoading || !selectedCar) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader className="h-12 w-12 animate-spin text-primary" />
            <p>Loading car data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background" ref={pageRef}>
      <Navbar />
      <Card>
        <CarSection
          key={selectedCar.id}
          id={selectedCar.id}
          model={selectedCar.model}
          title={selectedCar.title}
          description={selectedCar.description}
          pricePerDay={selectedCar.pricePerDay}
          pricePerKm={selectedCar.pricePerKm}
          image={selectedCar.image}
          color={selectedCar.color}
          features={selectedCar.features}
          index={carId || "0"}
        />
      </Card>
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-10 text-center page-title">
            Complete Your Booking
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 car-details">
              <div className="glass-panel p-6 rounded-2xl">
                {selectedCar.images && selectedCar.images.length > 0 ? (
                  <div className="mb-6">
                    <CarImageCarousel 
                      images={selectedCar.images} 
                      title={selectedCar.title}
                    />
                  </div>
                ) : (
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-xl rounded-xl"></div>
                    <img 
                      src={selectedCar.image} 
                      alt={selectedCar.title} 
                      className="w-full h-48 object-contain relative z-10"
                    />
                  </div>
                )}
                
                <h2 className="text-2xl font-bold mb-2">{selectedCar.model} {selectedCar.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedCar.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Starting at</p>
                    <div className="flex items-end gap-1">
                      <span className="text-xl font-bold">₹{selectedCar.pricePerDay}</span>
                      <span className="text-gray-500 dark:text-gray-400 mb-1">/day</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">₹{selectedCar.pricePerKm}/km mileage fee</p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {selectedCar.video && (
                      <Button 
                        onClick={handleWatchVideo}
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-2"
                      >
                        <Play className="h-4 w-4" />
                        <span>Watch Video</span>
                      </Button>
                    )}
                    
                    <Button
                      onClick={scrollToBookingForm}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Rental Insights */}
              {selectedCar.insights && selectedCar.insights.length > 0 && (
                <RentalInsights insights={selectedCar.insights} />
              )}
            </div>

            <div ref={bookingFormRef} id="booking-form-section" className="lg:col-span-8 booking-container">
              <BookingForm car={selectedCar} />
            </div>
          </div>
        </div>
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
