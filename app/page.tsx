"use client";

import { useState, useEffect } from "react";
import { Ride } from "./types";
import { getRides, joinRide } from "./store";
import Link from "next/link";

export default function Home() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [search, setSearch] = useState("");
  const [joining, setJoining] = useState<string | null>(null);
  const [passengerName, setPassengerName] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setRides(getRides());
  }, []);

  const filtered = rides.filter(
    (r) =>
      r.from.toLowerCase().includes(search.toLowerCase()) ||
      r.to.toLowerCase().includes(search.toLowerCase()) ||
      r.driver.toLowerCase().includes(search.toLowerCase())
  );

  function handleJoin(rideId: string) {
    if (!passengerName.trim()) return;
    const ok = joinRide(rideId, passengerName.trim());
    if (ok) {
      setRides(getRides());
      showToast("You joined the ride!");
    } else {
      showToast("No seats left!");
    }
    setJoining(null);
    setPassengerName("");
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚗</span>
            <span className="text-xl font-bold text-indigo-700">CarpoolNow</span>
          </div>
          <Link
            href="/offer"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            + Offer a Ride
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Find your next ride
          </h1>
          <p className="text-gray-500 text-lg">
            Share rides, save money, reduce emissions.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by city, driver..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Available Rides", value: rides.length },
            { label: "Open Seats", value: rides.reduce((s, r) => s + r.seatsLeft, 0) },
            { label: "Avg Price", value: `$${rides.length ? Math.round(rides.reduce((s, r) => s + r.price, 0) / rides.length) : 0}` },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-indigo-600">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Rides */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="text-center text-gray-400 py-16">No rides found.</div>
          )}
          {filtered.map((ride) => (
            <div key={ride.id} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Route */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-base font-semibold text-gray-800">{ride.from}</div>
                    <span className="text-indigo-400 text-xl">→</span>
                    <div className="text-base font-semibold text-gray-800">{ride.to}</div>
                  </div>

                  {/* Details row */}
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500 mb-3">
                    <span>📅 {ride.date}</span>
                    <span>🕐 {ride.time}</span>
                    <span>👤 {ride.driver}</span>
                    <span>💺 {ride.seatsLeft}/{ride.seats} seats left</span>
                  </div>

                  {ride.notes && (
                    <p className="text-sm text-gray-400 italic">{ride.notes}</p>
                  )}

                  {ride.passengers.length > 0 && (
                    <div className="mt-2 text-xs text-gray-400">
                      Passengers: {ride.passengers.join(", ")}
                    </div>
                  )}
                </div>

                {/* Price + Action */}
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <div className="text-2xl font-bold text-indigo-600">${ride.price}</div>
                  {ride.seatsLeft > 0 ? (
                    joining === ride.id ? (
                      <div className="flex flex-col gap-2 items-end">
                        <input
                          autoFocus
                          type="text"
                          placeholder="Your name"
                          value={passengerName}
                          onChange={(e) => setPassengerName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleJoin(ride.id)}
                          className="border rounded-lg px-3 py-1.5 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setJoining(null)}
                            className="text-xs text-gray-400 hover:text-gray-600"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleJoin(ride.id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded-lg transition"
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setJoining(ride.id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition"
                      >
                        Join Ride
                      </button>
                    )
                  ) : (
                    <span className="text-xs text-red-400 font-medium">Full</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-3 rounded-full shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}
