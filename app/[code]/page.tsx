"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Community } from "@/lib/types";
import Link from "next/link";

function CommunityHome() {
  const { code } = useParams<{ code: string }>();
  const searchParams = useSearchParams();
  const isNew = searchParams.get("new") === "1";
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/communities/${code}`)
      .then((r) => r.json())
      .then((d) => { setCommunity(d); setLoading(false); });
  }, [code]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </main>
    );
  }

  if (!community || (community as { error?: string }).error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Community not found.</p>
        <Link href="/" className="btn-primary">Go Home</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🚐</span>
            <span className="text-xl font-bold text-indigo-700">SchoolPool</span>
          </Link>
          <div className="flex gap-3">
            <Link href={`/${code}/community`} className="text-sm text-gray-500 hover:text-indigo-600 px-3 py-2">Community</Link>
            <Link href={`/${code}/schedule`} className="text-sm text-gray-500 hover:text-indigo-600 px-3 py-2">Schedule</Link>
            <Link href={`/${code}/register`} className="btn-primary text-sm">+ Register</Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-14 text-center">
        {isNew && (
          <div className="mb-8 bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-4 text-left flex gap-3">
            <span className="text-xl">🎉</span>
            <div>
              <div className="font-semibold">Community created!</div>
              <div className="text-sm text-green-600 mt-0.5">Share the code below with your neighbors so they can join.</div>
            </div>
          </div>
        )}

        <div className="text-4xl mb-4">🏫</div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{community.name}</h1>
        <p className="text-gray-500 mb-1">{community.school_name}</p>
        <p className="text-gray-400 text-sm mb-8">{community.neighborhood}</p>

        {/* Invite code */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <p className="text-sm text-gray-400 mb-2">Share this code with neighbors</p>
          <div className="text-4xl font-mono font-bold tracking-widest text-indigo-600 mb-3">
            {community.code}
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(community.code)}
            className="text-xs text-indigo-500 hover:underline"
          >
            Copy code
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href={`/${code}/register`} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition text-sm">
            📝 Register My Family
          </Link>
          <Link href={`/${code}/community`} className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition text-sm border border-gray-200">
            👨‍👩‍👧 View Community
          </Link>
          <Link href={`/${code}/schedule`} className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition text-sm border border-gray-200">
            📅 View Schedule
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function CommunityPage() {
  return (
    <Suspense>
      <CommunityHome />
    </Suspense>
  );
}
