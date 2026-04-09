"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Community } from "@/lib/types";
import Link from "next/link";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const DAY_NAMES: Record<string, string> = { monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday" };
const GRADES = ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

interface Kid { name: string; grade: string; }
interface DayAvail { can_drop: boolean; can_pickup: boolean; drop_time: string; pickup_time: string; }

export default function RegisterPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const [community, setCommunity] = useState<Community | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [parent, setParent] = useState({ parent_name: "", email: "", phone: "", address: "", seats: "3" });
  const [kids, setKids] = useState<Kid[]>([{ name: "", grade: "K" }]);
  const [avail, setAvail] = useState<Record<string, DayAvail>>(
    Object.fromEntries(DAYS.map((d) => [d, { can_drop: false, can_pickup: false, drop_time: "07:30", pickup_time: "15:00" }]))
  );

  useEffect(() => {
    fetch(`/api/communities/${code}`).then((r) => r.json()).then(setCommunity);
  }, [code]);

  const updateParent = (k: string, v: string) => setParent((p) => ({ ...p, [k]: v }));
  const addKid = () => setKids((p) => [...p, { name: "", grade: "K" }]);
  const removeKid = (i: number) => setKids((p) => p.filter((_, idx) => idx !== i));
  const updateKid = (i: number, k: keyof Kid, v: string) =>
    setKids((p) => p.map((kid, idx) => (idx === i ? { ...kid, [k]: v } : kid)));
  const updateAvail = (day: string, k: keyof DayAvail, v: boolean | string) =>
    setAvail((p) => ({ ...p, [day]: { ...p[day], [k]: v } }));

  const getLocation = useCallback((): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { timeout: 5000 }
      );
    });
  }, []);

  async function handleSubmit() {
    if (!community) return;
    setLoading(true);
    setError("");
    const location = await getLocation();
    const availability = DAYS.filter((d) => avail[d].can_drop || avail[d].can_pickup).map((day) => ({
      day,
      can_drop: avail[day].can_drop,
      can_pickup: avail[day].can_pickup,
      drop_time: avail[day].can_drop ? avail[day].drop_time : null,
      pickup_time: avail[day].can_pickup ? avail[day].pickup_time : null,
    }));

    const res = await fetch("/api/families", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        community_id: community.id,
        ...parent,
        seats: Number(parent.seats),
        lat: location?.lat ?? null,
        lng: location?.lng ?? null,
        kids: kids.filter((k) => k.name.trim()),
        availability,
      }),
    });

    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Something went wrong."); return; }
    router.push(`/${code}/schedule?registered=1`);
  }

  const canNext1 = parent.parent_name.trim() && parent.email.trim() && parent.phone.trim() && parent.address.trim();
  const canNext2 = kids.some((k) => k.name.trim());
  const canSubmit = DAYS.some((d) => avail[d].can_drop || avail[d].can_pickup);

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={`/${code}`} className="flex items-center gap-2">
            <span className="text-2xl">🚐</span>
            <span className="text-xl font-bold text-indigo-700">SchoolPool</span>
          </Link>
          {community && (
            <span className="text-sm text-gray-400">{community.name} · {community.school_name}</span>
          )}
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-10">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition ${step >= s ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-400"}`}>{s}</div>
              <span className={`text-xs ${step >= s ? "text-indigo-700 font-medium" : "text-gray-400"}`}>
                {s === 1 ? "Your Info" : s === 2 ? "Your Kids" : "Availability"}
              </span>
              {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? "bg-indigo-400" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">

          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Parent / Guardian Info</h2>
              <p className="text-sm text-gray-400 mb-6">Tell us who you are and where you live.</p>
              <div className="space-y-4">
                <div>
                  <label className="label">Full Name</label>
                  <input className="input" placeholder="e.g. Sarah Johnson" value={parent.parent_name}
                    onChange={(e) => updateParent("parent_name", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Email</label>
                    <input className="input" type="email" placeholder="you@email.com" value={parent.email}
                      onChange={(e) => updateParent("email", e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input className="input" type="tel" placeholder="(555) 000-0000" value={parent.phone}
                      onChange={(e) => updateParent("phone", e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="label">Home Address</label>
                  <input className="input" placeholder="e.g. 123 Maple St" value={parent.address}
                    onChange={(e) => updateParent("address", e.target.value)} />
                  <p className="text-xs text-gray-400 mt-1">Used to group you with nearby neighbors.</p>
                </div>
                <div>
                  <label className="label">Seats Available (for other kids)</label>
                  <select className="input" value={parent.seats} onChange={(e) => updateParent("seats", e.target.value)}>
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <button disabled={!canNext1} onClick={() => setStep(2)} className="mt-6 w-full btn-primary disabled:opacity-40">
                Next: Add Kids →
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Your Kids</h2>
              <p className="text-sm text-gray-400 mb-6">Add each child who needs a school carpool.</p>
              <div className="space-y-3">
                {kids.map((kid, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <input className="input" placeholder={`Child ${i + 1} name`} value={kid.name}
                        onChange={(e) => updateKid(i, "name", e.target.value)} />
                    </div>
                    <div className="w-28">
                      <select className="input" value={kid.grade} onChange={(e) => updateKid(i, "grade", e.target.value)}>
                        {GRADES.map((g) => <option key={g} value={g}>Grade {g}</option>)}
                      </select>
                    </div>
                    {kids.length > 1 && (
                      <button onClick={() => removeKid(i)} className="mt-2 text-gray-300 hover:text-red-400 transition">✕</button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={addKid} className="mt-3 text-sm text-indigo-600 hover:underline">+ Add another child</button>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1">← Back</button>
                <button disabled={!canNext2} onClick={() => setStep(3)} className="btn-primary flex-1 disabled:opacity-40">
                  Next: Availability →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Your Availability</h2>
              <p className="text-sm text-gray-400 mb-6">Which days can you drive for drop-off or pick-up?</p>
              <div className="space-y-3">
                {DAYS.map((day) => (
                  <div key={day} className="border border-gray-100 rounded-xl p-4">
                    <div className="font-medium text-gray-800 mb-3">{DAY_NAMES[day]}</div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer flex-wrap">
                        <input type="checkbox" checked={avail[day].can_drop}
                          onChange={(e) => updateAvail(day, "can_drop", e.target.checked)}
                          className="accent-indigo-600 w-4 h-4" />
                        <span className="text-sm text-gray-700">Can drive drop-off</span>
                        {avail[day].can_drop && (
                          <input type="time" value={avail[day].drop_time}
                            onChange={(e) => updateAvail(day, "drop_time", e.target.value)}
                            className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                        )}
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer flex-wrap">
                        <input type="checkbox" checked={avail[day].can_pickup}
                          onChange={(e) => updateAvail(day, "can_pickup", e.target.checked)}
                          className="accent-indigo-600 w-4 h-4" />
                        <span className="text-sm text-gray-700">Can drive pick-up</span>
                        {avail[day].can_pickup && (
                          <input type="time" value={avail[day].pickup_time}
                            onChange={(e) => updateAvail(day, "pickup_time", e.target.value)}
                            className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                        )}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              {error && (
                <div className="mt-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>
              )}
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="btn-secondary flex-1">← Back</button>
                <button disabled={!canSubmit || loading} onClick={handleSubmit} className="btn-primary flex-1 disabled:opacity-40">
                  {loading ? "Registering..." : "Register →"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
