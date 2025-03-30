
import React, { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car } from '@/data/cars';

interface CarCardProps {
  car: Car;
  onCardClick: (car: Car) => void;
}

const CarCard = forwardRef<HTMLDivElement, CarCardProps>(({ car, onCardClick }, ref) => {
  const navigate = useNavigate();
  
  const handleViewDetails = (e: React.MouseEvent, car: Car) => {
    e.stopPropagation(); // Prevent card click from triggering
    navigate(`/booking/${car.id}`);
  };

  return (
    <Card 
      ref={ref}
      className="overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => onCardClick(car)}
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100 dark:bg-gray-800">
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        ></div>
        <img 
          src={car.image} 
          alt={car.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        {car.video && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/30 rounded-full p-3">
              <Play className="h-10 w-10 text-white" />
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: car.color }}></span>
            <span className="text-white text-sm font-medium">{car.video ? 'Watch video' : 'Learn more'}</span>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-bold mb-1">{car.title.split(' ').slice(1).join(' ')}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{car.model}</p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">From</p>
            <p className="text-lg font-bold">₹{car.pricePerKm}/km</p>
          </div>
          <div>
            <Button 
              onClick={(e) => handleViewDetails(e, car)} 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 text-primary group-hover:translate-x-1 transition-transform duration-300"
            >
              <span className="text-sm font-medium">View details</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.33325 8H12.6666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 3.33337L12.6667 8.00004L8 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

CarCard.displayName = "CarCard";

export default CarCard;
