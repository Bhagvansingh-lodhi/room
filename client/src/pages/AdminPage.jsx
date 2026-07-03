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

  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 animate-spin text-sky-600">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.3" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <span className="text-slate-600">Loading...</span>
      </div>
    );
  }
  if (!user || user.role !== 'admin') return <Navigate to="/login" />;

  const roleBadgeStyles = {
    admin: 'bg-purple-100 text-purple-700',
    owner: 'bg-amber-100 text-amber-700',
    student: 'bg-sky-100 text-sky-700',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Panel</h1>
        <p className="mt-1.5 text-slate-600">Manage rooms and users.</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0">
            <path d="m4.5 10.5 4 4 7-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0">
            <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 6.5v4M10 13.2h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {error}
        </div>
      )}

      <div className="flex gap-2 rounded-xl bg-slate-100 p-1 w-fit">
        <button
          onClick={() => setTab('rooms')}
          className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors duration-150 ${
            tab === 'rooms' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Rooms
          {rooms.filter(r => !r.approved).length > 0 && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
              {rooms.filter(r => !r.approved).length} pending
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('users')}
          className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-colors duration-150 ${
            tab === 'users' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Users
        </button>
      </div>

      {tab === 'rooms' && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {rooms.map(room => (
              <article
                key={room._id}
                className={`flex flex-col gap-5 rounded-3xl bg-white p-6 shadow-sm ring-1 sm:flex-row ${
                  room.approved ? 'ring-slate-100' : 'ring-amber-100'
                }`}
              >
                <div className="h-32 w-full shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:w-32">
                  {room.images?.[0]?.url ? (
                    <img src={room.images[0].url} alt={room.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
                        <circle cx="8.5" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.6" />
                        <path d="m5 17 4.5-4.5L12 15l3-3 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h2 className="text-xl font-semibold text-slate-900">{room.title}</h2>
                    {!room.approved && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Pending</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{room.description}</p>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-500">
                    <span className="font-semibold text-sky-600">₹{room.rent}/mo</span>
                    <span className="flex items-center gap-1">
                      <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
                        <path d="M10 18s6-4.5 6-9.5A6 6 0 0 0 4 8.5C4 13.5 10 18 10 18Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        <circle cx="10" cy="8.3" r="2" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      {room.city}
                    </span>
                    <span>{room.roomType}</span>
                    <span>Owner: {room.owner?.name}</span>
                  </div>
                  {!room.approved && (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => approveRoom(room._id)}
                        className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-emerald-700"
                      >
                        <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
                          <path d="m4.5 10.5 4 4 7-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Approve
                      </button>
                      <button
                        onClick={() => rejectRoom(room._id)}
                        className="flex items-center gap-1.5 rounded-full bg-red-50 px-5 py-2 text-sm font-semibold text-red-600 transition-colors duration-150 hover:bg-red-600 hover:text-white"
                      >
                        <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
                          <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Reject
                      </button>
                    </div>
                  )}
                  {room.approved && (
                    <div className="mt-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                        <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3">
                          <path d="m4.5 10.5 4 4 7-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Approved
                      </span>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
          {rooms.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-3xl bg-white py-12 text-center shadow-sm ring-1 ring-slate-100">
              <p className="text-slate-600">No rooms to manage.</p>
            </div>
          )}
        </div>
      )}

      {tab === 'users' && (
        <div className="overflow-x-auto rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
          <table className="w-full">
            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u._id} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
                        {u.name?.slice(0, 1).toUpperCase()}
                      </span>
                      <span className="font-medium text-slate-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{u.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${roleBadgeStyles[u.role] || 'bg-slate-100 text-slate-600'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="inline-flex items-center gap-1.5 font-medium text-red-600 transition-colors hover:text-red-700"
                    >
                      <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
                        <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="py-12 text-center text-slate-600">No users found.</p>
          )}
        </div>
      )}
    </div>
  );
}