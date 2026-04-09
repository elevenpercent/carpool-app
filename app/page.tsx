"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    const res = await fetch(`/api/communities/${code.trim().toUpperCase()}`);
    if (!res.ok) {
      setError("Community not found. Check the code and try again.");
      setLoading(false);
      return;
    }
    router.push(`/${code.trim().toUpperCase()}`);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 flex flex-col">
      <header className="bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-2">
          <span className="text-2xl">🚐</span>
          <span className="text-xl font-bold text-indigo-700">SchoolPool</span>
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <h1 className="text-5xl font-extrabold text-gray-900 text-center leading-tight mb-4 max-w-xl">
          School carpools for your{" "}
          <span className="text-indigo-600">neighborhood.</span>
        </h1>
        <p className="text-gray-500 text-lg text-center max-w-md mb-12">
          Create a community for your school and street, or join one your neighbor already started.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* Create */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 flex flex-col">
            <div className="text-3xl mb-3">🏫</div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Create a Community</h2>
            <p className="text-sm text-gray-400 mb-6 flex-1">
              Set up a new carpool group for your school and neighborhood. You&apos;ll get a shareable code for neighbors to join.
            </p>
            <Link
              href="/create"
              className="btn-primary text-center"
            >
              Create Community
            </Link>
          </div>

          {/* Join */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 flex flex-col">
            <div className="text-3xl mb-3">🔑</div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Join a Community</h2>
            <p className="text-sm text-gray-400 mb-4 flex-1">
              Got a code from a neighbor? Enter it below to join their carpool community.
            </p>
            <form onSubmit={handleJoin} className="flex flex-col gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter code (e.g. AB12CD)"
                maxLength={6}
                className="input font-mono tracking-widest text-center text-lg"
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button type="submit" disabled={loading || !code.trim()} className="btn-primary disabled:opacity-40">
                {loading ? "Looking up..." : "Join Community"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="text-center text-xs text-gray-300 py-6">
        SchoolPool — Built for your community
      </footer>
    </main>
  );
}
