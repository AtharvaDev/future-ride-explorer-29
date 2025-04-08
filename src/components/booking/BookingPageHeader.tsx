
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { Car } from '@/data/cars';

interface BookingPageHeaderProps {
  selectedCar: Car;
  onWatchVideo: () => void;
  onScrollToBookingForm: () => void;
}

const BookingPageHeader: React.FC<BookingPageHeaderProps> = ({
  selectedCar,
  onWatchVideo,
  onScrollToBookingForm
}) => {
  return (
    <div className="glass-panel p-6 rounded-2xl">
      {selectedCar.images && selectedCar.images.length > 0 ? (
        <div className="mb-6">
          {/* CarImageCarousel is imported and rendered in parent component */}
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
              onClick={onWatchVideo}
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              <span>Watch Video</span>
            </Button>
          )}
          
          <Button
            onClick={onScrollToBookingForm}
            size="sm"
            className="flex items-center gap-2"
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingPageHeader;
