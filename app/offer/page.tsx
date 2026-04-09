"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addRide } from "../store";
import { Ride } from "../types";
import Link from "next/link";

export default function OfferPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    driver: "",
    from: "",
    to: "",
    date: "",
    time: "",
    seats: "3",
    price: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ride: Ride = {
      id: Date.now().toString(),
      driver: form.driver,
      from: form.from,
      to: form.to,
      date: form.date,
      time: form.time,
      seats: Number(form.seats),
      seatsLeft: Number(form.seats),
      price: Number(form.price),
      notes: form.notes,
      passengers: [],
      createdAt: new Date().toISOString(),
    };
    addRide(ride);
    setSubmitted(true);
    setTimeout(() => router.push("/"), 1500);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🚗</span>
            <span className="text-xl font-bold text-indigo-700">CarpoolNow</span>
          </Link>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Offer a Ride</h1>
          <p className="text-gray-500 text-sm mb-6">Fill in the details and let passengers find you.</p>

          {submitted ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-lg font-semibold text-gray-800">Ride posted!</p>
              <p className="text-gray-500 text-sm mt-1">Redirecting to home...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  required
                  name="driver"
                  value={form.driver}
                  onChange={handleChange}
                  placeholder="e.g. Alex Chen"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <input
                    required
                    name="from"
                    value={form.from}
                    onChange={handleChange}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <input
                    required
                    name="to"
                    value={form.to}
                    onChange={handleChange}
                    placeholder="e.g. Los Angeles, CA"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    required
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                  <input
                    required
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available Seats</label>
                  <select
                    name="seats"
                    value={form.seats}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per Seat ($)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="e.g. 25"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Stops, car type, rules..."
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition mt-2"
              >
                Post Ride
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
