
import { AuthUser } from '@/types/auth';
import { BookingContactInfo, BookingStatus } from '@/types/booking';

export interface BookingNotificationDetails {
  id: string;
  userId: string;
  carId: string;
  startDate: Date;
  endDate: Date;
  startCity: string;
  status: string;
  contactInfo: BookingContactInfo;
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
