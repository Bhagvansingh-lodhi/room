import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';

export default function StudentDashboard() {
  const { user, api } = useAuth();
  const [savedRooms, setSavedRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedRooms();
  }, []);

  const fetchSavedRooms = async () => {
    try {
      const res = await api.get('/saved');
      if (res.data.success) {
        setSavedRooms(res.data.data.savedRooms || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async roomId => {
    try {
      const res = await api.delete(`/saved/${roomId}`);
      if (res.data.success) {
        setSavedRooms(savedRooms.filter(r => r._id !== roomId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (user?.role !== 'student') {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-red-50 p-10 text-center ring-1 ring-red-100">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
            <path d="M9.5 9.5l5 5m0-5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
        <p className="font-semibold text-red-700">Access denied</p>
        <p className="text-sm text-red-600">This dashboard is available to students only.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Saved Rooms</h1>
          <p className="mt-1.5 text-slate-600">Your favorite room listings</p>
        </div>
        {!loading && savedRooms.length > 0 && (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700">
            {savedRooms.length} saved
          </span>
        )}
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="mb-4 h-40 rounded-xl bg-slate-100" />
              <div className="h-4 w-3/4 rounded bg-slate-100" />
              <div className="mt-3 h-3 w-full rounded bg-slate-100" />
              <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
              <div className="mt-5 h-9 w-full rounded-lg bg-slate-100" />
            </div>
          ))}
        </div>
      ) : savedRooms.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-slate-50 p-12 text-center ring-1 ring-slate-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
            <svg viewBox="0 0 24 24" className="h-6 w-6">
              <path
                d="M12 20s-7-4.35-9.5-8.8C.9 8 2.3 4.5 5.8 4c2-.3 3.8.6 6.2 3 2.4-2.4 4.2-3.3 6.2-3 3.5.5 4.9 4 3.3 7.2C19 15.65 12 20 12 20Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <p className="text-lg font-medium text-slate-700">No saved rooms yet</p>
          <p className="text-sm text-slate-500">Browse available rooms and save your favorites!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedRooms.map(room => (
            <div
              key={room._id}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-sky-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-40 overflow-hidden bg-slate-100">
                {room.images?.[0]?.url ? (
                  <img
                    src={room.images[0].url}
                    alt={room.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center gap-2 text-slate-400">
                    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
                      <circle cx="8.5" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.6" />
                      <path d="m5 17 4.5-4.5L12 15l3-3 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm">No image</span>
                  </div>
                )}
                <span className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-red-500 shadow-sm backdrop-blur-sm">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-red-500">
                    <path d="M12 20s-7-4.35-9.5-8.8C.9 8 2.3 4.5 5.8 4c2-.3 3.8.6 6.2 3 2.4-2.4 4.2-3.3 6.2-3 3.5.5 4.9 4 3.3 7.2C19 15.65 12 20 12 20Z" />
                  </svg>
                </span>
                <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
                  {room.roomType}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900">{room.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{room.description}</p>

                <div className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5 shrink-0">
                      <path d="M10 18s6-4.5 6-9.5A6 6 0 0 0 4 8.5C4 13.5 10 18 10 18Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                      <circle cx="10" cy="8.3" r="2" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    {room.city}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 shrink-0 fill-amber-400">
                      <path d="M10 1.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L10 14.9l-5.25 2.75 1-5.85L1.5 7.65l5.9-.85L10 1.5Z" />
                    </svg>
                    {room.averageRating ? `${room.averageRating.toFixed(1)}/5` : 'No ratings'}
                  </div>
                  <p className="font-bold text-sky-600">
                    ₹{room.rent}
                    <span className="text-xs font-medium text-slate-400">/mo</span>
                  </p>
                </div>

                <button
                  onClick={() => handleUnsave(room._id)}
                  className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors duration-200 hover:bg-red-600 hover:text-white"
                >
                  <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
                    <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  Remove from Saved
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}