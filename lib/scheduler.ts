import { Family, Kid, CarpoolGroup, DaySchedule } from "./types";

export const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];
export const DAY_LABELS: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
};

function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 3958.8; // miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function distance(a: Family, b: Family): number {
  if (a.lat && a.lng && b.lat && b.lng) {
    return haversine(a.lat, a.lng, b.lat, b.lng);
  }
  return 999; // unknown location — put at end
}

function buildGroups(
  drivers: Family[],
  passengers: Family[],
  type: "drop" | "pickup"
): { groups: CarpoolGroup[]; unassigned: Family[] } {
  if (drivers.length === 0) {
    return { groups: [], unassigned: passengers };
  }

  const groups: CarpoolGroup[] = drivers.map((driver) => {
    const av = driver.availability.find((a) => a.day === "placeholder");
    return {
      driver,
      passengers: [],
      allKids: [...driver.kids],
      type,
      time: "", // filled below
    };
  });

  const unassigned: Family[] = [];

  for (const passenger of passengers) {
    // Find nearest driver with available seats
    let bestGroup: CarpoolGroup | null = null;
    let bestDist = Infinity;

    for (const group of groups) {
      const seatsUsed = group.passengers.reduce(
        (sum, p) => sum + p.kids.length,
        0
      ) + group.driver.kids.length;
      const seatsLeft = group.driver.seats - seatsUsed;

      if (seatsLeft >= passenger.kids.length) {
        const dist = distance(passenger, group.driver);
        if (dist < bestDist) {
          bestDist = dist;
          bestGroup = group;
        }
      }
    }

    if (bestGroup) {
      bestGroup.passengers.push(passenger);
      bestGroup.allKids.push(...passenger.kids);
    } else {
      unassigned.push(passenger);
    }
  }

  return { groups, unassigned };
}

export function generateSchedule(families: Family[]): DaySchedule[] {
  return DAYS.map((day) => {
    const participating = families.filter((f) =>
      f.availability.some((a) => a.day === day)
    );

    const dropDrivers = participating.filter((f) =>
      f.availability.some((a) => a.day === day && a.can_drop)
    );
    const pickupDrivers = participating.filter((f) =>
      f.availability.some((a) => a.day === day && a.can_pickup)
    );

    const dropPassengers = participating.filter(
      (f) => !dropDrivers.includes(f)
    );
    const pickupPassengers = participating.filter(
      (f) => !pickupDrivers.includes(f)
    );

    const dropResult = buildGroups(dropDrivers, dropPassengers, "drop");
    const pickupResult = buildGroups(pickupDrivers, pickupPassengers, "pickup");

    // Attach times to groups
    dropResult.groups.forEach((g) => {
      const av = g.driver.availability.find((a) => a.day === day);
      g.time = av?.drop_time || "";
    });
    pickupResult.groups.forEach((g) => {
      const av = g.driver.availability.find((a) => a.day === day);
      g.time = av?.pickup_time || "";
    });

    // Families in neither drop nor pickup groups
    const allAssigned = new Set([
      ...dropResult.groups.flatMap((g) => [g.driver, ...g.passengers]),
      ...pickupResult.groups.flatMap((g) => [g.driver, ...g.passengers]),
    ]);
    const unassigned = participating.filter((f) => !allAssigned.has(f));

    return {
      day,
      drops: dropResult.groups,
      pickups: pickupResult.groups,
      unassigned,
    };
  });
}
