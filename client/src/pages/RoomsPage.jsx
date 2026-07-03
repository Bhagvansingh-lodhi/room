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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Available Rooms</h1>
          <p className="mt-2 text-slate-600">Explore PGs, hostels and private rooms across cities.</p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm space-y-4">
        <h2 className="font-semibold">Filters</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="City"
            value={filters.city}
            onChange={e => setFilters({ ...filters, city: e.target.value })}
            className="px-4 py-2 border border-slate-300 rounded-lg"
          />
          <select
            value={filters.roomType}
            onChange={e => setFilters({ ...filters, roomType: e.target.value })}
            className="px-4 py-2 border border-slate-300 rounded-lg"
          >
            <option value="">All Room Types</option>
            <option value="Room">Room</option>
            <option value="PG">PG</option>
            <option value="Hostel">Hostel</option>
          </select>
          <select
            value={filters.sort}
            onChange={e => setFilters({ ...filters, sort: e.target.value })}
            className="px-4 py-2 border border-slate-300 rounded-lg"
          >
            <option value="newest">Newest</option>
            <option value="rentLowToHigh">Rent: Low to High</option>
            <option value="rentHighToLow">Rent: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg bg-white p-8 shadow-sm text-center">Loading rooms...</div>
      ) : rooms.length === 0 ? (
        <div className="rounded-lg bg-white p-8 shadow-sm text-center text-slate-600">
          No rooms found. Try changing your filters.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map(room => (
            <article key={room._id} className="rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="h-48 overflow-hidden rounded-lg bg-slate-200 mb-4 relative">
                {room.images?.[0]?.url ? (
                  <img src={room.images[0].url} alt={room.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">No image</div>
                )}
                {user?.role === 'student' && (
                  <button
                    onClick={() => (isSaved(room._id) ? handleUnsaveRoom(room._id) : handleSaveRoom(room._id))}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:bg-slate-100"
                  >
                    {isSaved(room._id) ? '❤️' : '🤍'}
                  </button>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{room.title}</h2>
                <p className="mt-2 text-slate-600 line-clamp-2 text-sm">{room.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-slate-500">
                    <p>{room.city}</p>
                    <p className="font-semibold text-lg text-sky-600">₹{room.rent}/mo</p>
                  </div>
                  <div className="text-right text-sm">
                    <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-700">{room.roomType}</span>
                  </div>
                </div>
                <Link
                  to={`/rooms/${room._id}`}
                  className="mt-4 inline-flex rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-sky-700 font-medium"
                >
                  View details
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
