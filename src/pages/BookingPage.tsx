
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

const BookingPage = () => {
  console.log("BookingPage component rendering");
  const { carId } = useParams();
  const navigate = useNavigate();
  const [videoOpen, setVideoOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  // Log parameters for debugging
  console.log("BookingPage params - carId:", carId);

  const { data: cars = [], isLoading: carsLoading, error: carsError } = useQuery({
    queryKey: ['cars'],
    queryFn: getAllCars,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3
  });

  console.log("BookingPage cars loaded:", cars.length, "Loading:", carsLoading, "Error:", !!carsError);

  const selectedCar = carId 
    ? cars.find(car => car.id === carId) || (cars.length > 0 ? cars[0] : null)
    : cars.length > 0 ? cars[0] : null;
    
  console.log("BookingPage selectedCar:", selectedCar?.id);

  // Handle initial page load
  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("BookingPage initial load effect");
  }, []);

  // Handle car selection and navigation
  useEffect(() => {
    if (!carsLoading && cars.length > 0) {
      if (carId && !cars.find(car => car.id === carId)) {
        toast.error("Car not found, redirecting to default options");
        navigate(`/booking/${cars[0].id}`);
      } else if (!carId) {
        // If no car ID specified, redirect to the first car
        navigate(`/booking/${cars[0].id}`);
      }
    }
  }, [carId, cars, navigate, carsLoading]);

  // Error display when car data validation fails
  useEffect(() => {
    if (carsError) {
      const errorMessage = carsError instanceof Error ? carsError.message : 'Unknown error loading cars';
      toast.error(errorMessage);
      console.error('Cars loading error:', carsError);
    }
  }, [carsError]);

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
  };

  if (carsLoading || !selectedCar) {
    console.log("BookingPage showing loading state");
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader className="h-12 w-12 animate-spin text-primary" />
            <p className="animate-pulse">Loading car data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  console.log("BookingPage rendering main content");
  return (
    <div className="min-h-screen flex flex-col bg-background" ref={pageRef}>
      <Navbar />
      
      <div>
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
