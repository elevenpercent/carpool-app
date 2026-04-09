"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Family, Community } from "@/lib/types";
import Link from "next/link";

const DAY_SHORT: Record<string, string> = { monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu", friday: "Fri" };

export default function CommunityPage() {
  const { code } = useParams<{ code: string }>();
  const [community, setCommunity] = useState<Community | null>(null);
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/communities/${code}`)
      .then((r) => r.json())
      .then((c) => {
        setCommunity(c);
        return fetch(`/api/families?community_id=${c.id}`);
      })
      .then((r) => r.json())
      .then((f) => { setFamilies(f); setLoading(false); });
  }, [code]);

  const totalKids = families.reduce((s, f) => s + f.kids.length, 0);
  const driverDays = families.reduce((s, f) => s + f.availability.filter((a) => a.can_drop || a.can_pickup).length, 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={`/${code}`} className="flex items-center gap-2">
            <span className="text-2xl">🚐</span>
            <span className="text-xl font-bold text-indigo-700">SchoolPool</span>
          </Link>
          <div className="flex gap-3">
            <Link href={`/${code}/schedule`} className="text-sm text-gray-500 hover:text-indigo-600 px-3 py-2">Schedule</Link>
            <Link href={`/${code}/register`} className="btn-primary text-sm">+ Register</Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {community && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{community.name}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{community.school_name} · {community.neighborhood}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Families", value: families.length },
            { label: "Kids", value: totalKids },
            { label: "Driver Days", value: driverDays },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-indigo-600">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {loading && <div className="text-center text-gray-400 py-20">Loading...</div>}

        {!loading && families.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">No families yet.</p>
            <Link href={`/${code}/register`} className="btn-primary inline-block">Be the first to join</Link>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {families.map((family) => {
            const dropDays = family.availability.filter((a) => a.can_drop).map((a) => DAY_SHORT[a.day]);
            const pickupDays = family.availability.filter((a) => a.can_pickup).map((a) => DAY_SHORT[a.day]);
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
                {family.kids.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {family.kids.map((kid) => (
                      <span key={kid.id} className="text-xs bg-sky-50 text-sky-700 px-2.5 py-1 rounded-full">
                        {kid.name} · Gr.{kid.grade}
                      </span>
                    ))}
                  </div>
                )}
                <div className="text-xs space-y-1">
                  {dropDays.length > 0 && <div className="text-green-700">🟢 Drop-off: {dropDays.join(", ")}</div>}
                  {pickupDays.length > 0 && <div className="text-amber-700">🟡 Pick-up: {pickupDays.join(", ")}</div>}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">
                  {family.phone}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
