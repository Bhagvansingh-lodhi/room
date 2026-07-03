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
    return <div className="p-6 bg-red-50 rounded-lg">Access denied. Student only.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Saved Rooms</h1>
        <p className="mt-2 text-slate-600">Your favorite room listings</p>
      </div>

      {loading ? (
        <div className="p-8 text-center">Loading your saved rooms...</div>
      ) : savedRooms.length === 0 ? (
        <div className="rounded-lg bg-slate-50 p-12 text-center">
          <p className="text-slate-600 text-lg">No saved rooms yet</p>
          <p className="text-slate-500 text-sm mt-2">Browse available rooms and save your favorites!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {savedRooms.map(room => (
            <div key={room._id} className="rounded-lg bg-white p-6 shadow-sm border border-sky-200">
              <div className="h-40 rounded-lg bg-slate-200 overflow-hidden mb-4">
                {room.images?.[0]?.url ? (
                  <img src={room.images[0].url} alt={room.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">No image</div>
                )}
              </div>
              <h3 className="font-semibold text-lg">{room.title}</h3>
              <p className="mt-2 text-slate-600 text-sm line-clamp-2">{room.description}</p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p><strong>City:</strong> {room.city}</p>
                <p><strong>Rent:</strong> ₹{room.rent}/mo</p>
                <p><strong>Type:</strong> {room.roomType}</p>
                <p><strong>Rating:</strong> {room.averageRating ? `${room.averageRating.toFixed(1)}/5` : 'No ratings'}</p>
              </div>
              <button
                onClick={() => handleUnsave(room._id)}
                className="mt-4 w-full px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-medium"
              >
                Remove from Saved
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
