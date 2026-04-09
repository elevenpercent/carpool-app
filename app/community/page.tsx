"use client";

import { useState, useEffect } from "react";
import { Family } from "@/lib/types";
import Link from "next/link";

const DAY_LABELS: Record<string, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
};

export default function CommunityPage() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/families")
      .then((r) => r.json())
      .then((data) => {
        setFamilies(data);
        setLoading(false);
      });
  }, []);

  const totalKids = families.reduce((s, f) => s + f.kids.length, 0);
  const totalDriverDays = families.reduce(
    (s, f) => s + f.availability.filter((a) => a.can_drop || a.can_pickup).length,
    0
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🚐</span>
            <span className="text-xl font-bold text-indigo-700">SchoolPool</span>
          </Link>
          <div className="flex gap-3">
            <Link href="/schedule" className="text-sm text-gray-500 hover:text-indigo-600 px-3 py-2">Schedule</Link>
            <Link href="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
              + Join
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Neighborhood Community</h1>
            <p className="text-sm text-gray-400 mt-1">All registered families in your school carpool.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Families", value: families.length },
            { label: "Kids", value: totalKids },
            { label: "Driver Days", value: totalDriverDays },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-indigo-600">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="text-center text-gray-400 py-20">Loading families...</div>
        )}

        {!loading && families.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">No families registered yet.</p>
            <Link href="/register" className="btn-primary inline-block">Be the first to join</Link>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {families.map((family) => {
            const dropDays = family.availability.filter((a) => a.can_drop).map((a) => a.day);
            const pickupDays = family.availability.filter((a) => a.can_pickup).map((a) => a.day);
            return (
              <div key={family.id} className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-gray-900">{family.parent_name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{family.address}</div>
                  </div>
                  <div className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full font-medium">
                    {family.seats} seats
                  </div>
                </div>

                {/* Kids */}
                {family.kids.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {family.kids.map((kid) => (
                      <span key={kid.id} className="text-xs bg-sky-50 text-sky-700 px-2.5 py-1 rounded-full">
                        {kid.name} · Grade {kid.grade}
                      </span>
                    ))}
                  </div>
                )}

                {/* Availability */}
                <div className="text-xs space-y-1">
                  {dropDays.length > 0 && (
                    <div className="flex items-center gap-1.5 text-green-700">
                      <span>🟢 Drop-off:</span>
                      <span>{dropDays.map((d) => DAY_LABELS[d]).join(", ")}</span>
                    </div>
                  )}
                  {pickupDays.length > 0 && (
                    <div className="flex items-center gap-1.5 text-amber-700">
                      <span>🟡 Pick-up:</span>
                      <span>{pickupDays.map((d) => DAY_LABELS[d]).join(", ")}</span>
                    </div>
                  )}
                  {dropDays.length === 0 && pickupDays.length === 0 && (
                    <div className="text-gray-300 italic">No driving days set</div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-50 flex gap-3 text-xs text-gray-400">
                  <span>{family.email}</span>
                  <span>·</span>
                  <span>{family.phone}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
