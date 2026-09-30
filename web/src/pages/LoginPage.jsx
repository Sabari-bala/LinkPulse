import { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, bounce to dashboard
  if (isAuthenticated) {
    const to = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={to} replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.username.trim() || !form.password) {
      setError('Please enter both username and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        'Invalid credentials. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <div className="card auth-form relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
        <h2 className="text-2xl font-bold text-center text-ink-primary mt-2 mb-1">
          Welcome back
        </h2>
        <p className="text-center text-ink-muted text-sm mb-6">
          Log in to manage your links
        </p>

        {error && (
          <div className="mb-4 px-3 py-2 rounded-md bg-danger-light text-danger text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <Input
            id="username"
            name="username"
            label="Username"
            placeholder="Enter your username"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            className="mb-4"
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            className="mb-4"
          />

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={submitting || authLoading}
          >
            <LogIn className="w-4 h-4" />
            {submitting ? 'Signing in...' : 'Log In'}
          </button>
        </form>

        <div className="text-center text-sm text-ink-secondary mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-primary">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
