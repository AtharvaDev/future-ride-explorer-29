
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cars } from '@/data/cars';
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

const BookingPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [selectedCar, setSelectedCar] = useState(cars[0]);
  const [videoOpen, setVideoOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Find the selected car based on URL param
    if (carId) {
      const car = cars.find(car => car.id === carId);
      if (car) {
        setSelectedCar(car);
      } else {
        toast.error("Car not found, redirecting to default options");
        setSelectedCar(cars[0]);
      }
    }

    // GSAP animations for page entry
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

    // Cleanup animation on component unmount
    return () => {
      tl.kill();
    };
  }, [carId]);

  const handleWatchVideo = () => {
    setLoading(true);
    setVideoOpen(true);
    
    // Simulate video loading for 1.5 seconds
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

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
          index={carId}
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
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 booking-container">
              <BookingForm car={selectedCar} />
            </div>
          </div>
        </div>
      </main>

      {/* Video Dialog */}
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

      <Footer />
    </div>
  );
};

export default BookingPage;
