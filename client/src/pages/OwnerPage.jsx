import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export default function OwnerPage() {
  const { user, api, loading } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rent: '',
    city: '',
    area: '',
    address: '',
    roomType: 'PG',
    genderPreference: 'Any',
    amenities: '',
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (user?.role === 'owner') fetchRooms();
  }, [user]);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms?owner=' + user._id);
      setRooms(response.data.data.rooms || []);
    } catch (err) {
      setError('Failed to fetch rooms');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const formDataObj = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'amenities') {
          formDataObj.append(key, formData[key].split(',').map(a => a.trim()));
        } else {
          formDataObj.append(key, formData[key]);
        }
      });

      images.forEach(img => formDataObj.append('images', img));

      const response = await api.post('/rooms', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Room created successfully!');
      setFormData({
        title: '',
        description: '',
        rent: '',
        city: '',
        area: '',
        address: '',
        roomType: 'PG',
        genderPreference: 'Any',
        amenities: '',
      });
      setImages([]);
      setShowForm(false);
      fetchRooms();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create room');
    }
  };

  if (loading) return <div className="rounded-3xl bg-white p-8 shadow-sm">Loading...</div>;
  if (!user || user.role !== 'owner') return <Navigate to="/login" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Listings</h1>
          <p className="mt-2 text-slate-600">Manage your room listings and track inquiries.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-full bg-sky-600 px-6 py-3 text-white hover:bg-sky-700"
        >
          {showForm ? 'Cancel' : 'Add Room'}
        </button>
      </div>

      {success && <div className="rounded-3xl bg-green-50 border border-green-200 p-4 text-green-700">{success}</div>}
      {error && <div className="rounded-3xl bg-red-50 border border-red-200 p-4 text-red-700">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-8 shadow-sm space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <input
              type="text"
              placeholder="Room title (e.g., Cozy PG near campus)"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Monthly rent (₹)"
              value={formData.rent}
              onChange={e => setFormData({ ...formData, rent: e.target.value })}
              required
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              required
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Area"
              value={formData.area}
              onChange={e => setFormData({ ...formData, area: e.target.value })}
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none"
            />
          </div>

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none"
            rows="4"
          ></textarea>

          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={e => setFormData({ ...formData, address: e.target.value })}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none"
          />

          <div className="grid gap-6 md:grid-cols-2">
            <select
              value={formData.roomType}
              onChange={e => setFormData({ ...formData, roomType: e.target.value })}
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none"
            >
              <option value="PG">PG</option>
              <option value="Hostel">Hostel</option>
              <option value="Room">Room</option>
            </select>
            <select
              value={formData.genderPreference}
              onChange={e => setFormData({ ...formData, genderPreference: e.target.value })}
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none"
            >
              <option value="Boys">Boys</option>
              <option value="Girls">Girls</option>
              <option value="Any">Any</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Amenities (comma-separated: WiFi, AC, Kitchen, etc.)"
            value={formData.amenities}
            onChange={e => setFormData({ ...formData, amenities: e.target.value })}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-sky-500 focus:outline-none"
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Upload Images (up to 6)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={e => setImages(Array.from(e.target.files))}
              className="w-full"
            />
            {images.length > 0 && <p className="mt-2 text-sm text-slate-600">{images.length} files selected</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-sky-600 px-6 py-3 text-white hover:bg-sky-700 font-medium"
          >
            Create Room
          </button>
        </form>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {rooms.map(room => (
          <article key={room._id} className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="h-40 overflow-hidden rounded-3xl bg-slate-200">
              {room.images?.[0]?.url ? (
                <img src={room.images[0].url} alt={room.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">No image</div>
              )}
            </div>
            <div className="mt-4">
              <h2 className="text-lg font-semibold">{room.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{room.city}</p>
              <p className="mt-2 text-lg font-semibold">₹{room.rent}/mo</p>
              <div className="mt-3 flex gap-2">
                <span className="text-xs rounded-full bg-sky-100 px-2 py-1 text-sky-700">{room.roomType}</span>
                <span className={`text-xs rounded-full px-2 py-1 ${room.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {room.approved ? 'Approved' : 'Pending'}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
      {rooms.length === 0 && !showForm && (
        <div className="rounded-3xl bg-slate-50 p-8 text-center">
          <p className="text-slate-600">No rooms listed yet. Create your first listing!</p>
        </div>
      )}
    </div>
  );
}
