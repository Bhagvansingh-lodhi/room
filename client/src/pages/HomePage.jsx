import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Trusted Hosts',
    description: 'Find student-friendly owners and verified accommodations.',
    icon: (
      <path
        d="M12 3 4 9v11a1 1 0 0 0 1 1h5v-6h4v6h5a1 1 0 0 0 1-1V9l-8-6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: 'City Search',
    description: 'Filter listings by city, rent range, room type and preferences.',
    icon: (
      <>
        <path
          d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.8" />
      </>
    ),
  },
  {
    title: 'Easy Booking',
    description: 'Saved rooms and reviews keep your decision making simple.',
    icon: (
      <path
        d="m4.5 12.5 4.5 4.5L19.5 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];



export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-sky-600 to-indigo-700 p-10 text-white shadow-xl shadow-sky-200/50 sm:p-14">
        {/* decorative backdrop */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
          <svg className="absolute inset-0 h-full w-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M32 0H0V32" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-sky-50 ring-1 ring-white/20">
            <svg viewBox="0 0 8 8" className="h-1.5 w-1.5 fill-emerald-300">
              <circle cx="4" cy="4" r="4" />
            </svg>
            Verified listings, updated daily
          </span>

          <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Find your next student home
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-sky-100">
            Discover PGs, hostels and rooms near your campus with verified listings and easy bookings.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-900 shadow-lg shadow-black/10 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-slate-50"
            >
              Browse rooms
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-2xl font-bold">{stat.value}</dt>
                <dd className="text-sm text-sky-100">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="mb-8 max-w-xl">
          <h2 className="text-2xl font-bold text-slate-900">Why students choose StudentNest</h2>
          <p className="mt-2 text-slate-600">Everything you need to find a place near campus, without the guesswork.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition-colors duration-200 group-hover:bg-sky-600 group-hover:text-white">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  {feature.icon}
                </svg>
              </span>
              <h3 className="mt-5 text-xl font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-3 leading-relaxed text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
