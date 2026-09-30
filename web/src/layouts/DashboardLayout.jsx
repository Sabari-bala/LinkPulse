import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Link as LinkIcon, BarChart3, User, Plus, LogOut, Menu, X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/links', label: 'Links', icon: LinkIcon },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const NavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
      isActive
        ? 'bg-primary-light text-primary'
        : 'text-ink-secondary hover:bg-surface-hover hover:text-primary'
    }`;

  return (
    <div className="min-h-screen flex bg-bg">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link to="/" className="text-lg font-bold text-primary">
            ShortMetric
          </Link>
        </div>

        <div className="p-4">
          <Link to="/create-link" className="btn btn-primary w-full">
            <Plus className="w-4 h-4" />
            Create Link
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={NavLinkClass}>
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="text-xs text-ink-muted mb-2 truncate">
            {user?.username}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-ink-secondary hover:bg-danger-light hover:text-danger transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-surface border-b border-border flex items-center justify-between px-4">
        <Link to="/" className="text-lg font-bold text-primary">ShortMetric</Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-md hover:bg-surface-hover"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-ink-primary/30" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute top-14 left-0 right-0 bg-surface border-b border-border p-4 space-y-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Link to="/create-link" className="btn btn-primary w-full mb-3" onClick={() => setMobileOpen(false)}>
              <Plus className="w-4 h-4" />
              Create Link
            </Link>
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={NavLinkClass}
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-ink-secondary hover:bg-danger-light hover:text-danger transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-0 pt-14 md:pt-0">
        <main className="p-4 md:p-8 max-w-6xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
