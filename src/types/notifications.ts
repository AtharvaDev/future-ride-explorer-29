
import { AuthUser } from '@/types/auth';

export interface BookingNotificationDetails {
  id: string;
  userId: string;
  carId: string;
  startDate: Date;
  endDate: Date;
  startCity: string;
  status: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  paymentInfo: {
    method: string;
    totalAmount: number;
    tokenAmount: number;
    isPaid: boolean;
    paidAt: Date;
  };
  car: {
    id: string;
    name: string;
    image: string;
    pricePerDay: number;
  };
}
