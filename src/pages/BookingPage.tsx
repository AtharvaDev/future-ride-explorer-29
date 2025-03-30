import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingForm from '@/components/BookingForm';
import { toast } from 'sonner';
import gsap from 'gsap';
import { Card } from '@/components/ui/card';
import CarSection from '@/components/CarSection';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader, Play } from 'lucide-react';
import { getAllCars } from '@/services/carService';
import { useQuery } from '@tanstack/react-query';

const BookingPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [videoOpen, setVideoOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const bookingFormRef = useRef<HTMLDivElement>(null);

  const { data: cars = [], isLoading: carsLoading } = useQuery({
    queryKey: ['cars'],
    queryFn: getAllCars
  });

  const selectedCar = carId 
    ? cars.find(car => car.id === carId) || (cars.length > 0 ? cars[0] : null)
    : cars.length > 0 ? cars[0] : null;

  useEffect(() => {
    window.scrollTo(0, 0);

    if (carId && cars.length > 0 && !cars.find(car => car.id === carId)) {
      toast.error("Car not found, redirecting to default options");
      if (cars.length > 0) {
        navigate(`/booking/${cars[0].id}`);
      }
    }

    const tl = gsap.timeline();
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
  }, [carId, cars, navigate]);

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
    <div className="min-h-screen flex flex-col bg-background">
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
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-xl rounded-xl"></div>
                  <img 
                    src={selectedCar.image} 
                    alt={selectedCar.title} 
                    className="w-full h-48 object-contain relative z-10"
                  />
                </div>
                
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
            </div>

            <div ref={bookingFormRef} className="lg:col-span-8 booking-container">
              <BookingForm car={selectedCar} />
            </div>
          </div>
        </div>
      </main>

      {selectedCar.video && (
        <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedCar.title}</DialogTitle>
            </DialogHeader>
            <div className="w-full h-[60vh] bg-black relative rounded-md overflow-hidden">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <Loader className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-gray-100">Loading video...</p>
                  </div>
                </div>
              ) : (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedCar.video?.split('v=')[1]?.split('&')[0]}`}
                  title={selectedCar.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  );
};

export default BookingPage;
