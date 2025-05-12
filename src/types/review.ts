
export interface Review {
  id?: string;
  name: string;
  rating: number;
  text: string;
  createdAt?: Date;
  displayOrder?: number;
}
