"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreatePage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", school_name: "", neighborhood: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(k: string, v: string) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/communities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }
    router.push(`/${data.code}?new=1`);
  }

  const canSubmit = form.name.trim() && form.school_name.trim() && form.neighborhood.trim();

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🚐</span>
            <span className="text-xl font-bold text-indigo-700">SchoolPool</span>
          </Link>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create a Community</h1>
          <p className="text-sm text-gray-400 mb-6">
            Set up a carpool group for your school. You&apos;ll get a code to share with neighbors.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Community Name</label>
              <input
                className="input"
                placeholder="e.g. Maple Street Parents"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">School Name</label>
              <input
                className="input"
                placeholder="e.g. Springfield Elementary"
                value={form.school_name}
                onChange={(e) => update("school_name", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Neighborhood / Area</label>
              <input
                className="input"
                placeholder="e.g. North Springfield"
                value={form.neighborhood}
                onChange={(e) => update("neighborhood", e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="btn-primary w-full disabled:opacity-40 mt-2"
            >
              {loading ? "Creating..." : "Create Community →"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
