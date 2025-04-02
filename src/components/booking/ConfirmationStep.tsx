
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Calendar, Car, Map, Phone, Mail, User } from 'lucide-react';
import { Car as CarType } from '@/data/cars';
import { BookingFormState, BookingSummary } from '@/hooks/useBookingFormState';

interface ConfirmationStepProps {
  formState: BookingFormState;
  bookingSummary: BookingSummary;
  car: CarType;
  onPrevious: () => void;
  onNext: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  formState,
  bookingSummary,
  car,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Review Your Booking</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Please review your booking details before proceeding to payment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Car className="w-5 h-5 mr-2 text-primary" />
              Car Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <img 
                  src={car.image} 
                  alt={car.title} 
                  className="w-20 h-20 object-cover rounded-lg mr-4" 
                />
                <div>
                  <h4 className="font-medium">{car.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{car.model}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Daily Rate</p>
                  <p className="font-medium">₹{bookingSummary.dailyRate}/day</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Extra KM Rate</p>
                  <p className="font-medium">₹{bookingSummary.extraKmRate}/km after {bookingSummary.baseKm} km</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Trip Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
                  <p className="font-medium">
                    {formState.startDate ? format(formState.startDate, 'MMM dd, yyyy') : 'Not selected'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">End Date</p>
                  <p className="font-medium">
                    {formState.endDate ? format(formState.endDate, 'MMM dd, yyyy') : 'Not selected'}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-primary" />
                  <p className="font-medium">{bookingSummary.totalDays} days</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pickup Location</p>
                <div className="flex items-center">
                  <Map className="w-4 h-4 mr-1 text-primary" />
                  <p className="font-medium">{formState.contactInfo.startCity}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" />
              Contact Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                <p className="font-medium">{formState.contactInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-1 text-primary" />
                  <p className="font-medium">{formState.contactInfo.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-1 text-primary" />
                  <p className="font-medium">{formState.contactInfo.phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-primary" />
              Payment Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-gray-500 dark:text-gray-400">Rental ({bookingSummary.totalDays} days × ₹{bookingSummary.dailyRate})</p>
                <p>₹{bookingSummary.subtotal.toFixed(2)}</p>
              </div>
              <div className="border-t my-2"></div>
              <div className="flex justify-between font-semibold">
                <p>Total Amount</p>
                <p>₹{bookingSummary.totalAmount.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-sm text-gray-500">Extra KM charges</p>
                <p className="text-sm">₹{bookingSummary.extraKmRate}/km after {bookingSummary.baseKm} km</p>
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t">
                <p className="text-primary font-medium">Token Amount</p>
                <p className="text-primary font-semibold">₹{bookingSummary.tokenAmount.toFixed(2)}</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                * Remaining amount to be paid at pickup
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <Button 
          onClick={onNext} 
          className="bg-primary text-white min-w-[150px]"
        >
          Proceed to Payment
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
