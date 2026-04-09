import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 flex flex-col">
      {/* Nav */}
      <header className="bg-white/80 backdrop-blur border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚐</span>
            <span className="text-xl font-bold text-indigo-700">SchoolPool</span>
          </div>
          <div className="flex gap-3">
            <Link href="/community" className="text-sm text-gray-600 hover:text-indigo-600 px-3 py-2">
              Community
            </Link>
            <Link href="/schedule" className="text-sm text-gray-600 hover:text-indigo-600 px-3 py-2">
              Schedule
            </Link>
            <Link
              href="/register"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Join Now
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span>🏫</span> School Carpool for Your Neighborhood
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-5 max-w-2xl">
          Get your kids to school{" "}
          <span className="text-indigo-600">together.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mb-10">
          Register your family, share your availability, and let SchoolPool
          build an optimized weekly carpool schedule — grouped by neighborhood.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href="/register"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-7 py-3.5 rounded-xl text-base transition shadow-sm"
          >
            Register My Family
          </Link>
          <Link
            href="/schedule"
            className="border border-gray-200 hover:border-indigo-300 text-gray-700 hover:text-indigo-700 font-medium px-7 py-3.5 rounded-xl text-base transition"
          >
            View This Week&apos;s Schedule
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-t border-gray-100 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "📝", title: "Register", desc: "Add your name, kids' info, and your home address so we can match you with nearby neighbors." },
              { icon: "📅", title: "Set Availability", desc: "Tell us which days you can drive for drop-off and/or pick-up, and at what times." },
              { icon: "🗺️", title: "Get Your Schedule", desc: "SchoolPool groups nearby families and generates an optimized weekly rotation automatically." },
            ].map((step) => (
              <div key={step.title} className="text-center">
                <div className="text-4xl mb-3">{step.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center text-xs text-gray-400 py-6">
        SchoolPool — Built for your community
      </footer>
    </main>
  );
}
