import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export default function RoomsPage() {
  const { api, user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedRoomIds, setSavedRoomIds] = useState([]);
  const [filters, setFilters] = useState({ city: '', roomType: '', sort: 'newest' });

  useEffect(() => {
    fetchRooms();
    if (user?.role === 'student') {
      fetchSavedRooms();
    }
  }, [filters, user]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await api.get('/rooms', { params: filters });
      const data = response.data.data;
      // Filter to show only approved rooms
      const approvedRooms = Array.isArray(data.rooms) ? data.rooms.filter(r => r.approved) : [];
      setRooms(approvedRooms);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedRooms = async () => {
    try {
      const response = await api.get('/saved');
      if (response.data.success) {
        setSavedRoomIds(response.data.data.savedRooms.map(r => r._id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveRoom = async roomId => {
    if (!user) {
      alert('Please login to save rooms');
      return;
    }
    try {
      const res = await api.post(`/saved/${roomId}`);
      if (res.data.success) {
        setSavedRoomIds([...savedRoomIds, roomId]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnsaveRoom = async roomId => {
    try {
      const res = await api.delete(`/saved/${roomId}`);
      if (res.data.success) {
        setSavedRoomIds(savedRoomIds.filter(id => id !== roomId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isSaved = roomId => savedRoomIds.includes(roomId);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Available Rooms</h1>
          <p className="mt-1.5 text-slate-600">Explore PGs, hostels and private rooms across cities.</p>
        </div>
        {!loading && (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700">
            {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'} found
          </span>
        )}
      </div>

      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="flex items-center gap-2 font-semibold text-slate-900">
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-sky-600">
            <path d="M3 4h14M6 10h8M9 16h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Filters
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <svg viewBox="0 0 20 20" fill="none" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8" />
              <path d="m17 17-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="City"
              value={filters.city}
              onChange={e => setFilters({ ...filters, city: e.target.value })}
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition-colors focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>
          <select
            value={filters.roomType}
            onChange={e => setFilters({ ...filters, roomType: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          >
            <option value="">All Room Types</option>
            <option value="Room">Room</option>
            <option value="PG">PG</option>
            <option value="Hostel">Hostel</option>
          </select>
          <select
            value={filters.sort}
            onChange={e => setFilters({ ...filters, sort: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          >
            <option value="newest">Newest</option>
            <option value="rentLowToHigh">Rent: Low to High</option>
            <option value="rentHighToLow">Rent: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="mb-4 h-48 rounded-xl bg-slate-100" />
              <div className="h-4 w-3/4 rounded bg-slate-100" />
              <div className="mt-3 h-3 w-full rounded bg-slate-100" />
              <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
              <div className="mt-5 h-9 w-28 rounded-lg bg-slate-100" />
            </div>
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <p className="font-medium text-slate-700">No rooms found</p>
          <p className="text-sm text-slate-500">Try changing your filters to see more results.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map(room => (
            <article
              key={room._id}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
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
                {user?.role === 'student' && (
                  <button
                    onClick={() => (isSaved(room._id) ? handleUnsaveRoom(room._id) : handleSaveRoom(room._id))}
                    className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm transition-transform duration-150 hover:scale-110"
                    aria-label={isSaved(room._id) ? 'Unsave room' : 'Save room'}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className={`h-4.5 w-4.5 transition-colors ${isSaved(room._id) ? 'fill-red-500 text-red-500' : 'fill-none text-slate-400'}`}
                    >
                      <path
                        d="M12 20s-7-4.35-9.5-8.8C.9 8 2.3 4.5 5.8 4c2-.3 3.8.6 6.2 3 2.4-2.4 4.2-3.3 6.2-3 3.5.5 4.9 4 3.3 7.2C19 15.65 12 20 12 20Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
                <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
                  {room.roomType}
                </span>
              </div>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-slate-900">{room.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{room.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-slate-500">
                    <p className="flex items-center gap-1">
                      <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
                        <path
                          d="M10 18s6-4.5 6-9.5A6 6 0 0 0 4 8.5C4 13.5 10 18 10 18Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                        <circle cx="10" cy="8.3" r="2" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      {room.city}
                    </p>
                    <p className="mt-0.5 text-lg font-bold text-sky-600">
                      ₹{room.rent}
                      <span className="text-xs font-medium text-slate-400">/mo</span>
                    </p>
                  </div>
                </div>
                <Link
                  to={`/rooms/${room._id}`}
                  className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-sky-700"
                >
                  View details
                  <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
                    <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}