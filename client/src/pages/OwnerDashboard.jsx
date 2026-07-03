import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';

export default function OwnerDashboard() {
  const { user, api } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rent: '',
    city: '',
    area: '',
    address: '',
    roomType: 'Room',
    genderPreference: 'Any',
    amenities: '',
  });

  useEffect(() => {
    if (user?.role === 'owner') {
      fetchOwnerRooms();
    }
  }, [user]);

  const fetchOwnerRooms = async () => {
    try {
      const res = await api.get('/rooms');
      if (res.data.success) {
        setRooms(res.data.data.rooms.filter(r => r.owner._id === user._id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('rent', formData.rent);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('area', formData.area);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('roomType', formData.roomType);
      formDataToSend.append('genderPreference', formData.genderPreference);
      formDataToSend.append('amenities', formData.amenities.split(',').map(a => a.trim()));

      for (let i = 0; i < images.length; i++) {
        formDataToSend.append('images', images[i]);
      }

      const res = await api.post('/rooms', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        alert('Room created successfully! Waiting for admin approval.');
        setFormData({
          title: '',
          description: '',
          rent: '',
          city: '',
          area: '',
          address: '',
          roomType: 'Room',
          genderPreference: 'Any',
          amenities: '',
        });
        setImages([]);
        setShowForm(false);
        fetchOwnerRooms();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating room');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'owner') {
    return <div className="p-6 bg-red-50 rounded-lg">Access denied. Owner only.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Owner Dashboard</h1>
          <p className="mt-2 text-slate-600">Manage your room listings</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 rounded-lg bg-sky-600 text-white hover:bg-sky-700"
        >
          {showForm ? 'Cancel' : 'Add New Room'}
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">Create New Room Listing</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-sky-500 outline-none"
                  placeholder="e.g., Cozy 1BHK near Campus"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rent (₹/month)</label>
                <input
                  type="number"
                  name="rent"
                  value={formData.rent}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-sky-500 outline-none"
                  placeholder="15000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-sky-500 outline-none"
                placeholder="Describe the room, amenities, and house rules..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-sky-500 outline-none"
                  placeholder="Mumbai"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Area</label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-sky-500 outline-none"
                  placeholder="Andheri"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-sky-500 outline-none"
                placeholder="Full address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Room Type</label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-sky-500 outline-none"
                >
                  <option value="Room">Room</option>
                  <option value="PG">PG</option>
                  <option value="Hostel">Hostel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gender Preference</label>
                <select
                  name="genderPreference"
                  value={formData.genderPreference}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-sky-500 outline-none"
                >
                  <option value="Any">Any</option>
                  <option value="Boys">Boys</option>
                  <option value="Girls">Girls</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Amenities (comma separated)</label>
              <input
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-sky-500 outline-none"
                placeholder="WiFi, AC, Kitchen, Attached Bathroom"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Room Photos (up to 6)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              />
              {images.length > 0 && <p className="mt-2 text-sm text-slate-600">{images.length} image(s) selected</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Room Listing'}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Your Listings</h2>
        {rooms.length === 0 ? (
          <div className="rounded-lg bg-slate-50 p-8 text-center">
            <p className="text-slate-600">No rooms listed yet. Create your first listing!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map(room => (
              <div key={room._id} className="rounded-lg bg-white p-6 shadow-sm">
                <div className="h-40 rounded-lg bg-slate-200 overflow-hidden mb-4">
                  {room.images?.[0]?.url ? (
                    <img src={room.images[0].url} alt={room.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">No image</div>
                  )}
                </div>
                <h3 className="font-semibold text-lg">{room.title}</h3>
                <p className="mt-2 text-slate-600 text-sm">{room.city}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-sky-600">₹{room.rent}/mo</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      room.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {room.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
