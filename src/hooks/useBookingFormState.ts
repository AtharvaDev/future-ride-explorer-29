
import { useState, useEffect, useCallback } from 'react';
import { Car } from '@/data/cars';
import { differenceInDays } from 'date-fns';
import { BookingContactInfo } from '@/types/booking';

export interface BookingFormState {
  step: number;
  startDate: Date | null;
  endDate: Date | null;
  startCity: string;
  contactInfo: BookingContactInfo;
  loginMethod: 'google' | 'email' | null;
  paymentMethod: string;
  totalDays: number;
  totalAmount: number;
  tokenAmount: number;
  isDatesValid: boolean;
}

export interface BookingSummary {
  totalDays: number;
  dailyRate: number;
  subtotal: number;
  tax: number;
  totalAmount: number;
  tokenAmount: number;
}

export function useBookingFormState(car: Car) {
  const [formState, setFormState] = useState<BookingFormState>({
    step: 1,
    startDate: null,
    endDate: null,
    startCity: 'Bangalore',
    contactInfo: {
      name: '',
      email: '',
      phone: '',
      startCity: 'Bangalore',
      specialRequests: '',
    },
    loginMethod: null,
    paymentMethod: 'creditCard',
    totalDays: 0,
    totalAmount: 0,
    tokenAmount: 0,
    isDatesValid: false,
  });

  const [bookingSummary, setBookingSummary] = useState<BookingSummary>({
    totalDays: 0,
    dailyRate: car.pricePerDay,
    subtotal: 0,
    tax: 0,
    totalAmount: 0,
    tokenAmount: 0,
  });

  // Calculate booking summary whenever dates change
  useEffect(() => {
    if (formState.startDate && formState.endDate) {
      const days = Math.max(1, differenceInDays(formState.endDate, formState.startDate));
      const isDatesValid = days > 0;
      
      // Only calculate if dates are valid
      if (isDatesValid) {
        const subtotal = days * car.pricePerDay;
        const tax = subtotal * 0.18; // 18% GST
        const totalAmount = subtotal + tax;
        const tokenAmount = totalAmount * 0.2; // 20% token amount
        
        setBookingSummary({
          totalDays: days,
          dailyRate: car.pricePerDay,
          subtotal,
          tax,
          totalAmount,
          tokenAmount,
        });
        
        // Update the form state with the calculated values
        setFormState(prev => ({
          ...prev,
          totalDays: days,
          totalAmount,
          tokenAmount,
          isDatesValid,
        }));
      } else {
        setFormState(prev => ({
          ...prev,
          isDatesValid: false,
        }));
      }
    }
  }, [formState.startDate, formState.endDate, car.pricePerDay]);

  const setDates = (startDate: Date | null, endDate: Date | null) => {
    setFormState(prev => ({
      ...prev,
      startDate,
      endDate,
    }));
  };

  const setStartCity = (city: string) => {
    setFormState(prev => ({
      ...prev,
      startCity: city,
    }));
  };

  const setContactInfo = (contactInfo: BookingContactInfo) => {
    setFormState(prev => ({
      ...prev,
      contactInfo,
    }));
  };

  const setLoginMethod = (method: 'google' | 'email' | null) => {
    setFormState(prev => ({
      ...prev,
      loginMethod: method,
    }));
  };

  const setPaymentMethod = (method: string) => {
    setFormState(prev => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  const nextStep = () => {
    setFormState(prev => ({
      ...prev,
      step: prev.step + 1,
    }));
  };

  const prevStep = () => {
    setFormState(prev => ({
      ...prev,
      step: Math.max(1, prev.step - 1),
    }));
  };

  const goToStep = (step: number) => {
    setFormState(prev => ({
      ...prev,
      step,
    }));
  };

  // Reset to step 1
  const resetStep = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      step: 1,
    }));
  }, []);

  return {
    formState,
    bookingSummary,
    setDates,
    setStartCity,
    setContactInfo,
    setLoginMethod,
    setPaymentMethod,
    nextStep,
    prevStep,
    goToStep,
    resetStep
  };
}

export default useBookingFormState;
