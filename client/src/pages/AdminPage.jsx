import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export default function AdminPage() {
  const { user, api, loading } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('rooms');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      if (tab === 'rooms') fetchRooms();
      else fetchUsers();
    }
  }, [user, tab]);

  const fetchRooms = async () => {
    try {
      setError('');
      const response = await api.get('/admin/rooms');
      setRooms(response.data.data.rooms || []);
    } catch (err) {
      setError('Failed to fetch rooms');
    }
  };

  const fetchUsers = async () => {
    try {
      setError('');
      const response = await api.get('/admin/users');
      setUsers(response.data.data.users || []);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const approveRoom = async roomId => {
    try {
      setError('');
      setSuccess('');
      await api.patch(`/admin/rooms/${roomId}/approve`);
      setSuccess('Room approved!');
      fetchRooms();
    } catch (err) {
      setError('Failed to approve room');
    }
  };

  const rejectRoom = async roomId => {
    try {
      setError('');
      setSuccess('');
      await api.patch(`/admin/rooms/${roomId}/reject`);
      setSuccess('Room rejected!');
      fetchRooms();
    } catch (err) {
      setError('Failed to reject room');
    }
  };

  const deleteUser = async userId => {
    if (!confirm('Are you sure?')) return;
    try {
      setError('');
      setSuccess('');
      await api.delete(`/admin/users/${userId}`);
      setSuccess('User deleted!');
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  if (loading) return <div className="rounded-3xl bg-white p-8 shadow-sm">Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="mt-2 text-slate-600">Manage rooms and users.</p>
      </div>

      {success && <div className="rounded-3xl bg-green-50 border border-green-200 p-4 text-green-700">{success}</div>}
      {error && <div className="rounded-3xl bg-red-50 border border-red-200 p-4 text-red-700">{error}</div>}

      <div className="flex gap-4 border-b border-slate-200">
        <button
          onClick={() => setTab('rooms')}
          className={`px-6 py-3 font-medium border-b-2 transition ${
            tab === 'rooms' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-600'
          }`}
        >
          Rooms ({rooms.filter(r => !r.approved).length} pending)
        </button>
        <button
          onClick={() => setTab('users')}
          className={`px-6 py-3 font-medium border-b-2 transition ${
            tab === 'users' ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-600'
          }`}
        >
          Users
        </button>
      </div>

      {tab === 'rooms' && (
        <div className="space-y-4">
          <div className="grid gap-6">
            {rooms.map(room => (
              <article key={room._id} className="rounded-3xl bg-white p-6 shadow-sm flex gap-6">
                <div className="h-32 w-32 rounded-3xl bg-slate-200 overflow-hidden flex-shrink-0">
                  {room.images?.[0]?.url ? (
                    <img src={room.images[0].url} alt={room.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">No image</div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{room.title}</h2>
                  <p className="mt-1 text-slate-600">{room.description}</p>
                  <div className="mt-3 flex gap-4 text-sm">
                    <span>₹{room.rent}/mo</span>
                    <span>{room.city}</span>
                    <span>{room.roomType}</span>
                    <span>Owner: {room.owner?.name}</span>
                  </div>
                  {!room.approved && (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => approveRoom(room._id)}
                        className="rounded-full bg-green-600 px-6 py-2 text-white hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectRoom(room._id)}
                        className="rounded-full bg-red-600 px-6 py-2 text-white hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {room.approved && (
                    <div className="mt-4">
                      <span className="text-xs rounded-full bg-green-100 px-3 py-1 text-green-700">Approved</span>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
          {rooms.length === 0 && <p className="text-center text-slate-600 py-8">No rooms to manage.</p>}
        </div>
      )}

      {tab === 'users' && (
        <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm">{u.name}</td>
                  <td className="px-6 py-4 text-sm">{u.email}</td>
                  <td className="px-6 py-4 text-sm capitalize">{u.role}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="text-center text-slate-600 py-8">No users found.</p>
          )}
        </div>
      )}
    </div>
  );
}
