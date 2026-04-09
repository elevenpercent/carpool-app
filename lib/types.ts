export interface Community {
  id: string;
  name: string;
  school_name: string;
  neighborhood: string;
  code: string;
  created_at: string;
}

export interface Kid {
  id?: string;
  family_id?: string;
  name: string;
  grade: string;
}

export interface Availability {
  id?: string;
  family_id?: string;
  day: string;
  can_drop: boolean;
  can_pickup: boolean;
  drop_time: string;
  pickup_time: string;
}

export interface Family {
  id: string;
  community_id: string;
  parent_name: string;
  email: string;
  phone: string;
  address: string;
  lat: number | null;
  lng: number | null;
  seats: number;
  created_at: string;
  kids: Kid[];
  availability: Availability[];
}

export interface CarpoolGroup {
  driver: Family;
  passengers: Family[];
  allKids: Kid[];
  type: "drop" | "pickup";
  time: string;
}

export interface DaySchedule {
  day: string;
  drops: CarpoolGroup[];
  pickups: CarpoolGroup[];
  unassigned: Family[];
}
