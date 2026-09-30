import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut } from 'lucide-react';

export default function PublicLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <header className="sticky top-0 z-40 bg-surface border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary">
            ShortMetric
          </Link>
          <nav className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-ink-secondary hover:text-primary hover:bg-primary-light transition">
                  Dashboard
                </Link>
                <Link to="/create-link" className="px-3 py-2 rounded-md text-sm font-medium text-ink-secondary hover:text-primary hover:bg-primary-light transition">
                  Create Link
                </Link>
                <span className="text-sm text-ink-muted hidden md:inline">
                  {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-ink-secondary hover:text-danger hover:bg-danger-light transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/#features" className="px-3 py-2 rounded-md text-sm font-medium text-ink-secondary hover:text-primary hover:bg-primary-light transition">
                  Features
                </a>
                <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium text-ink-secondary hover:text-primary hover:bg-primary-light transition">
                  Login
                </Link>
                <Link to="/register" className="btn btn-outline">
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-surface py-6">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-ink-muted">
          ShortMetric is an independent portfolio project.
        </div>
      </footer>
    </div>
  );
}
