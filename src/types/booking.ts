
import { Timestamp } from 'firebase/firestore';

export type BookingStatus = 'draft' | 'confirmed' | 'completed' | 'cancelled';

export interface BookingBasicInfo {
  id?: string;
  carId: string;
  startDate: Date;
  endDate: Date;
  startCity: string;
  status: BookingStatus;
  userId: string;
}

export interface BookingContactInfo {
  name: string;
  email: string;
  phone: string;
  startCity: string;
  specialRequests?: string;
}

export interface BookingPaymentInfo {
  paymentMethod: 'upi' | 'card' | 'cash' | 'razorpay';
  upiId?: string;
  paymentId?: string;
  tokenAmount: number;
  totalAmount: number;
  isPaid: boolean;
  paidAt?: Date;
}

export interface Booking {
  id: string;
  basicInfo: BookingBasicInfo;
  contactInfo?: BookingContactInfo;
  paymentInfo?: BookingPaymentInfo;
  car?: {
    id: string;
    name: string;
    image: string;
    pricePerDay: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Add missing types needed by bookingService.ts
export interface BookingData {
  carId: string;
  startDate: Date | Timestamp;
  endDate: Date | Timestamp;
  startCity: string;
  status: BookingStatus;
  userId: string;
  createdAt?: Date | Timestamp;
  paymentInfo?: PaymentInfo;
}

export interface PaymentInfo {
  paymentMethod: 'upi' | 'card' | 'cash' | 'razorpay';
  upiId?: string;
  paymentId?: string;
  tokenAmount: number;
  totalAmount: number;
  isPaid: boolean;
  paidAt?: Date;
}

export interface CompleteBookingData {
  id: string;
  carId: string;
  startDate: Date;
  endDate: Date;
  startCity: string;
  status: BookingStatus;
  car?: {
    id: string;
    title: string;
    image: string;
    pricePerDay: number; // Changed from price to pricePerDay to match Car type
  };
  paymentInfo?: PaymentInfo;
  userId: string;
  createdAt?: Date;
}
