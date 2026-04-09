import { Ride } from "./types";

const SEED_RIDES: Ride[] = [
  {
    id: "1",
    driver: "Alex Chen",
    from: "San Francisco, CA",
    to: "Los Angeles, CA",
    date: "2026-04-15",
    time: "08:00",
    seats: 4,
    seatsLeft: 2,
    price: 35,
    notes: "Making one stop in San Jose. Comfortable SUV, no smoking.",
    passengers: ["Maria L.", "James T."],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    driver: "Priya Patel",
    from: "Oakland, CA",
    to: "Sacramento, CA",
    date: "2026-04-12",
    time: "07:30",
    seats: 3,
    seatsLeft: 3,
    price: 15,
    notes: "Direct route via I-80. Hybrid car.",
    passengers: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    driver: "Marco Rivera",
    from: "Berkeley, CA",
    to: "San Jose, CA",
    date: "2026-04-11",
    time: "09:00",
    seats: 2,
    seatsLeft: 1,
    price: 12,
    notes: "Leaving from Berkeley BART station.",
    passengers: ["Sophie W."],
    createdAt: new Date().toISOString(),
  },
];

const STORAGE_KEY = "carpool_rides";

export function getRides(): Ride[] {
  if (typeof window === "undefined") return SEED_RIDES;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_RIDES));
    return SEED_RIDES;
  }
  return JSON.parse(stored);
}

export function saveRides(rides: Ride[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rides));
}

export function addRide(ride: Ride): void {
  const rides = getRides();
  saveRides([ride, ...rides]);
}

export function joinRide(rideId: string, passengerName: string): boolean {
  const rides = getRides();
  const idx = rides.findIndex((r) => r.id === rideId);
  if (idx === -1) return false;
  const ride = rides[idx];
  if (ride.seatsLeft <= 0) return false;
  rides[idx] = {
    ...ride,
    seatsLeft: ride.seatsLeft - 1,
    passengers: [...ride.passengers, passengerName],
  };
  saveRides(rides);
  return true;
}
