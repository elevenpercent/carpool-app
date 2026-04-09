export interface Ride {
  id: string;
  driver: string;
  from: string;
  to: string;
  date: string;
  time: string;
  seats: number;
  seatsLeft: number;
  price: number;
  notes: string;
  passengers: string[];
  createdAt: string;
}
