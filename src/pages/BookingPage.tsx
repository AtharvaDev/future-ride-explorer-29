
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

const BookingPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [selectedCar, setSelectedCar] = useState(cars[0]);

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
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Starting at</p>
                    <div className="flex items-end gap-1">
                      <span className="text-xl font-bold">₹{selectedCar.pricePerDay}</span>
                      <span className="text-gray-500 dark:text-gray-400 mb-1">/day</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">₹{selectedCar.pricePerKm}/km mileage fee</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 booking-container">
              <BookingForm car={selectedCar} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingPage;
