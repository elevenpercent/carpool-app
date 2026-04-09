"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { DaySchedule, CarpoolGroup, Community } from "@/lib/types";
import { DAYS, DAY_LABELS } from "@/lib/scheduler";
import Link from "next/link";

const DAY_FULL: Record<string, string> = { monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday" };

function formatTime(t: string) {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = Number(h);
  return `${hour > 12 ? hour - 12 : hour || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
}

function GroupCard({ group }: { group: CarpoolGroup }) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium text-gray-800 text-sm">
          🚗 {group.driver.parent_name}
          <span className="text-xs text-gray-400 ml-2">(driver · {group.driver.seats} seats)</span>
        </div>
        {group.time && (
          <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full">
            {formatTime(group.time)}
          </span>
        )}
      </div>
      <div className="text-xs text-gray-400 mb-2">{group.driver.address}</div>
      {group.passengers.map((p) => (
        <div key={p.id} className="text-xs text-gray-600 flex items-center gap-1.5 mb-1">
          <span className="text-gray-300">→</span>
          <span>{p.parent_name}</span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-400">{p.address}</span>
        </div>
      ))}
      <div className="flex flex-wrap gap-1.5 mt-2">
        {group.allKids.map((kid, i) => (
          <span key={i} className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
            {kid.name} · Gr.{kid.grade}
          </span>
        ))}
      </div>
    </div>
  );
}

function ScheduleContent() {
  const { code } = useParams<{ code: string }>();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";
  const [community, setCommunity] = useState<Community | null>(null);
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(DAYS[0]);

  async function load(communityId: string) {
    setLoading(true);
    const res = await fetch(`/api/schedule?community_id=${communityId}`);
    const data = await res.json();
    setSchedule(data);
    setLoading(false);
  }

  useEffect(() => {
    fetch(`/api/communities/${code}`)
      .then((r) => r.json())
      .then((c) => { setCommunity(c); load(c.id); });
  }, [code]);

  const currentDay = schedule.find((s) => s.day === activeDay);

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={`/${code}`} className="flex items-center gap-2">
            <span className="text-2xl">🚐</span>
            <span className="text-xl font-bold text-indigo-700">SchoolPool</span>
          </Link>
          <div className="flex gap-3">
            <Link href={`/${code}/community`} className="text-sm text-gray-500 hover:text-indigo-600 px-3 py-2">Community</Link>
            <Link href={`/${code}/register`} className="btn-primary text-sm">+ Register</Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {justRegistered && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-4 flex items-center gap-3">
            <span className="text-xl">🎉</span>
            <div>
              <div className="font-semibold">You&apos;re registered!</div>
              <div className="text-sm text-green-600">Here&apos;s the optimized schedule for your community.</div>
            </div>
          </div>
        )}

        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Weekly Schedule</h1>
            {community && <p className="text-sm text-gray-400 mt-0.5">{community.name} · {community.school_name}</p>}
          </div>
          {community && (
            <button onClick={() => load(community.id)} className="text-sm text-indigo-600 hover:underline">↻ Refresh</button>
          )}
        </div>

        {/* Day tabs */}
        <div className="flex gap-2 mb-6">
          {DAYS.map((day) => {
            const s = schedule.find((x) => x.day === day);
            const hasActivity = s && (s.drops.length > 0 || s.pickups.length > 0);
            return (
              <button key={day} onClick={() => setActiveDay(day)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${activeDay === day ? "bg-indigo-600 text-white shadow-sm" : "bg-white text-gray-600 hover:bg-indigo-50"}`}>
                {DAY_LABELS[day]}
                {hasActivity && <span className={`ml-1 text-xs ${activeDay === day ? "text-indigo-200" : "text-indigo-400"}`}>●</span>}
              </button>
            );
          })}
        </div>

        {loading && <div className="text-center text-gray-400 py-20">Building schedule...</div>}

        {!loading && (
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">🟢 Morning Drop-off</h2>
              {currentDay && currentDay.drops.length > 0 ? (
                <div className="space-y-3">
                  {currentDay.drops.map((group, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm p-4">
                      <GroupCard group={group} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm p-6 text-center text-gray-300 text-sm">
                  No drop-off groups for {DAY_FULL[activeDay]}.
                </div>
              )}
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">🟡 Afternoon Pick-up</h2>
              {currentDay && currentDay.pickups.length > 0 ? (
                <div className="space-y-3">
                  {currentDay.pickups.map((group, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm p-4">
                      <GroupCard group={group} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm p-6 text-center text-gray-300 text-sm">
                  No pick-up groups scheduled.
                </div>
              )}
            </div>

            {currentDay && currentDay.unassigned.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-3">⚠️ Needs a Driver</h2>
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-2">
                  {currentDay.unassigned.map((f) => (
                    <div key={f.id} className="text-sm text-amber-800">
                      {f.parent_name} — {f.kids.map((k) => k.name).join(", ")}
                    </div>
                  ))}
                  <p className="text-xs text-amber-600 mt-2">Ask a neighbor to volunteer as driver on this day!</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function SchedulePage() {
  return <Suspense><ScheduleContent /></Suspense>;
}
