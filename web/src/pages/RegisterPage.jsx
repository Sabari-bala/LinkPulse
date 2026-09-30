import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.username.trim()) return setError('Username is required.');
    if (!form.email.trim()) return setError('Email is required.');
    if (!form.password) return setError('Password is required.');
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    if (form.password !== form.password2) return setError('Passwords do not match.');

    setSubmitting(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const data = err.response?.data;
      let msg = 'Registration failed. Please check your details.';
      if (data) {
        if (data.username) msg = `Username: ${[].concat(data.username).join(' ')}`;
        else if (data.email) msg = `Email: ${[].concat(data.email).join(' ')}`;
        else if (data.password) msg = `Password: ${[].concat(data.password).join(' ')}`;
        else if (data.password2) msg = `Confirm password: ${[].concat(data.password2).join(' ')}`;
        else if (data.detail) msg = data.detail;
      }
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <div className="card relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
        <h2 className="text-2xl font-bold text-center text-ink-primary mt-2 mb-1">
          Create account
        </h2>
        <p className="text-center text-ink-muted text-sm mb-6">
          Start shortening links in seconds
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
            placeholder="Choose a username"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            className="mb-4"
          />
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            className="mb-4"
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            className="mb-4"
          />
          <Input
            id="password2"
            name="password2"
            type="password"
            label="Confirm Password"
            placeholder="Re-enter password"
            value={form.password2}
            onChange={handleChange}
            autoComplete="new-password"
            className="mb-4"
          />

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={submitting || authLoading}
          >
            <UserPlus className="w-4 h-4" />
            {submitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="text-center text-sm text-ink-secondary mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
