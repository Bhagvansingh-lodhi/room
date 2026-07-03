import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth.js';
import { Navigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) return <div className="rounded-3xl bg-white p-8 shadow-sm text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  if (user.role === 'owner') {
    return <Navigate to="/owner" />;
  }
  if (user.role === 'admin') {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold">My Dashboard</h1>
      <div className="mt-6 space-y-4 rounded-3xl bg-slate-50 p-6">
        <div>
          <p className="text-sm text-slate-500">Name</p>
          <p className="mt-1 text-lg font-medium">{user.name}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Email</p>
          <p className="mt-1 text-lg font-medium">{user.email}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Role</p>
          <p className="mt-1 text-lg font-medium capitalize">{user.role}</p>
        </div>
      </div>
    </div>
  );
}
