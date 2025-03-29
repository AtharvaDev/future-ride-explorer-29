
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
  paymentMethod: 'upi' | 'card' | 'cash';
  upiId?: string;
  tokenAmount: number;
  totalAmount: number;
  isPaid: boolean;
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
    price: number;
  };
  paymentInfo?: BookingPaymentInfo;
  userId: string;
}
