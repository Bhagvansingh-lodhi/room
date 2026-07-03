import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';

const roleBadgeStyles = {
  admin: 'bg-purple-100 text-purple-700',
  owner: 'bg-amber-100 text-amber-700',
  student: 'bg-sky-100 text-sky-700',
};

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
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-red-50 p-10 text-center ring-1 ring-red-100">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
            <path d="M9.5 9.5l5 5m0-5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
        <p className="font-semibold text-red-700">Access denied</p>
        <p className="text-sm text-red-600">This dashboard is available to admins only.</p>
      </div>
    );
  }

  const pendingRooms = rooms.filter(r => !r.approved);
  const approvedRooms = rooms.filter(r => r.approved);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
        <p className="mt-1.5 text-slate-600">Manage rooms and users</p>
      </div>

      <div className="flex gap-2 rounded-xl bg-slate-100 p-1 w-fit">
        <button
          onClick={() => setActiveTab('rooms')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
            activeTab === 'rooms' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Rooms
          {pendingRooms.length > 0 && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
              {pendingRooms.length} pending
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
            activeTab === 'users' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Users
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600">{users.length}</span>
        </button>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="mb-4 h-40 rounded-xl bg-slate-100" />
              <div className="h-4 w-3/4 rounded bg-slate-100" />
              <div className="mt-3 h-3 w-full rounded bg-slate-100" />
              <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ) : activeTab === 'rooms' ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Pending Room Approvals</h2>
          {pendingRooms.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl bg-slate-50 p-10 text-center ring-1 ring-slate-100">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                  <path d="m4.5 10.5 4 4 7-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p className="text-slate-600">No pending approvals</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingRooms.map(room => (
                <div key={room._id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-amber-100">
                  <div className="relative mb-4 h-40 overflow-hidden rounded-xl bg-slate-100">
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
                    <span className="absolute top-3 left-3 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 shadow-sm">
                      Pending
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900">{room.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{room.description}</p>
                  <div className="mt-4 space-y-1.5 text-sm text-slate-600">
                    <p className="flex justify-between"><span className="text-slate-400">City</span><span>{room.city}</span></p>
                    <p className="flex justify-between"><span className="text-slate-400">Rent</span><span className="font-semibold text-sky-600">₹{room.rent}/mo</span></p>
                    <p className="flex justify-between"><span className="text-slate-400">Type</span><span>{room.roomType}</span></p>
                    <p className="flex justify-between"><span className="text-slate-400">Owner</span><span className="text-right">{room.owner.name}</span></p>
                    <p className="text-right text-xs text-slate-400">{room.owner.email}</p>
                  </div>
                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => handleApprove(room._id)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-emerald-700"
                    >
                      <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
                        <path d="m4.5 10.5 4 4 7-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(room._id)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors duration-150 hover:bg-red-600 hover:text-white"
                    >
                      <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
                        <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Approved Rooms</h2>
            {approvedRooms.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl bg-slate-50 p-10 text-center ring-1 ring-slate-100">
                <p className="text-slate-600">No approved rooms yet</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {approvedRooms.map(room => (
                  <div key={room._id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-100">
                    <div className="mb-4 h-40 overflow-hidden rounded-xl bg-slate-100">
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
                    <h3 className="font-semibold text-lg text-slate-900">{room.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {room.city} · <span className="font-medium text-sky-600">₹{room.rent}/mo</span>
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                      <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3">
                        <path d="m4.5 10.5 4 4 7-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Approved
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">All Users</h2>
          {users.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl bg-slate-50 p-10 text-center ring-1 ring-slate-100">
              <p className="text-slate-600">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
              <table className="w-full">
                <thead className="border-b border-slate-100 bg-slate-50">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Email</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Role</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">City</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Action</th>
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
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${roleBadgeStyles[u.role] || 'bg-slate-100 text-slate-600'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{u.city || '-'}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors duration-150 hover:bg-red-600 hover:text-white"
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}