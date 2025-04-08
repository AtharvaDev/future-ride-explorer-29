
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
  const { carId } = useParams();
  const navigate = useNavigate();
  const [videoOpen, setVideoOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageReady, setPageReady] = useState(false);
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
