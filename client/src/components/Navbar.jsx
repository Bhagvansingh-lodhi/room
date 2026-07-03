import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileOpen(false);
  };

  const homeLinks = [
    { to: '/', label: 'Home' },
    { to: '/rooms', label: 'Rooms' },
  ];

  const userLinks = user ? (
    user.role === 'owner'
      ? [{ to: '/owner/dashboard', label: 'Owner Dashboard' }]
      : user.role === 'admin'
      ? [{ to: '/admin/dashboard', label: 'Admin Panel' }]
      : [{ to: '/student/dashboard', label: 'Saved Rooms' }]
  ) : [];

  const navLinkClass = ({ isActive }) =>
    `relative text-sm font-medium py-2 transition-colors duration-200 ${
      isActive ? 'text-sky-600' : 'text-slate-600 hover:text-slate-900'
    } after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-sky-600 after:transition-all after:duration-200 ${
      isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`;

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '';

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 shrink-0" onClick={() => setMobileOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-white shadow-sm shadow-sky-200">
            <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" strokeWidth="2">
              <path
                d="M3 11.5 12 4l9 7.5M5.5 10v9a1 1 0 0 0 1 1h3.5v-5.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V20H18.5a1 1 0 0 0 1-1v-9"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Student<span className="text-sky-600">Nest</span>
          </span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex md:items-center md:gap-8">
          {homeLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
          {userLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}

          <div className="ml-2 flex items-center gap-4 border-l border-slate-200 pl-6">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
                    {initials}
                  </span>
                  <span className="text-sm font-medium text-slate-700">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-red-600 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-sky-200 transition-colors duration-200 hover:bg-sky-700"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </nav>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" strokeWidth="2">
            {mobileOpen ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav panel */}
      <div
        className={`overflow-hidden border-t border-slate-100 bg-white transition-all duration-300 md:hidden ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          {homeLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
              {link.label}
            </NavLink>
          ))}
          {userLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
              {link.label}
            </NavLink>
          ))}

          <div className="mt-2 border-t border-slate-100 pt-3">
            {user ? (
              <div className="flex items-center justify-between px-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700">
                    {initials}
                  </span>
                  <span className="text-sm font-medium text-slate-700">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 px-3">
                <NavLink
                  to="/login"
                  className="rounded-lg px-3 py-2.5 text-center text-sm font-medium text-slate-600 hover:bg-slate-50"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-full bg-sky-600 px-4 py-2.5 text-center text-sm font-medium text-white shadow-sm shadow-sky-200 hover:bg-sky-700"
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}