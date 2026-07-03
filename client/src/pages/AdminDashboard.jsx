import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';

export default function AdminDashboard() {
  const { user, api } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('rooms');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsRes, usersRes] = await Promise.all([
        api.get('/admin/rooms'),
        api.get('/admin/users'),
      ]);
      if (roomsRes.data.success) setRooms(roomsRes.data.data.rooms);
      if (usersRes.data.success) setUsers(usersRes.data.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async roomId => {
    try {
      const res = await api.patch(`/admin/rooms/${roomId}/approve`);
      if (res.data.success) {
        alert('Room approved!');
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error approving room');
    }
  };

  const handleReject = async roomId => {
    try {
      const res = await api.patch(`/admin/rooms/${roomId}/reject`);
      if (res.data.success) {
        alert('Room rejected!');
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error rejecting room');
    }
  };

  const handleDeleteUser = async userId => {
    if (window.confirm('Delete this user?')) {
      try {
        const res = await api.delete(`/admin/users/${userId}`);
        if (res.data.success) {
          alert('User deleted!');
          fetchData();
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting user');
      }
    }
  };

  if (user?.role !== 'admin') {
    return <div className="p-6 bg-red-50 rounded-lg">Access denied. Admin only.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-slate-600">Manage rooms and users</p>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-3 font-medium ${activeTab === 'rooms' ? 'border-b-2 border-sky-600 text-sky-600' : 'text-slate-600'}`}
        >
          Rooms ({rooms.filter(r => !r.approved).length} pending)
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-3 font-medium ${activeTab === 'users' ? 'border-b-2 border-sky-600 text-sky-600' : 'text-slate-600'}`}
        >
          Users ({users.length})
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center">Loading...</div>
      ) : activeTab === 'rooms' ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Pending Room Approvals</h2>
          {rooms.filter(r => !r.approved).length === 0 ? (
            <div className="rounded-lg bg-slate-50 p-8 text-center">
              <p className="text-slate-600">No pending approvals</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rooms.filter(r => !r.approved).map(room => (
                <div key={room._id} className="rounded-lg bg-white p-6 shadow-sm">
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
                    <p><strong>Owner:</strong> {room.owner.name} ({room.owner.email})</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleApprove(room._id)}
                      className="flex-1 px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(room._id)}
                      className="flex-1 px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Approved Rooms</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rooms.filter(r => r.approved).map(room => (
                <div key={room._id} className="rounded-lg bg-white p-6 shadow-sm border border-green-200">
                  <div className="h-40 rounded-lg bg-slate-200 overflow-hidden mb-4">
                    {room.images?.[0]?.url ? (
                      <img src={room.images[0].url} alt={room.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400">No image</div>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg">{room.title}</h3>
                  <p className="mt-2 text-slate-600 text-sm">{room.city} - ₹{room.rent}/mo</p>
                  <span className="inline-block mt-3 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                    Approved
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">All Users</h2>
          {users.length === 0 ? (
            <div className="rounded-lg bg-slate-50 p-8 text-center">
              <p className="text-slate-600">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">City</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-b border-slate-200">
                      <td className="px-6 py-4 text-sm">{u.name}</td>
                      <td className="px-6 py-4 text-sm">{u.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{u.city || '-'}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
