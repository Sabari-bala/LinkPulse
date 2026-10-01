import { useState, useEffect, useCallback } from 'react';
import {
  User, Mail, Calendar, Link2, MousePointerClick,
  Pencil, X, Save, Lock,
} from 'lucide-react';
import { MetricCard, LoadingState, ErrorState, Input } from '../components';
import { authService } from '../services/authService';
import { analyticsService } from '../services/analyticsService';
import { useAuth } from '../hooks/useAuth';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({ username: '', email: '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    current_password: '', new_password: '', confirm_password: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [savingPassword, setSavingPassword] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [profileData, statsData] = await Promise.all([
        authService.getProfile(),
        analyticsService.dashboard(),
      ]);
      setProfile(profileData);
      setStats(statsData);
      setProfileForm({
        username: profileData.username || '',
        email: profileData.email || '',
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileErrors({});

    const next = {};
    if (!profileForm.username.trim()) next.username = 'Username is required.';
    if (profileForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      next.email = 'Please enter a valid email.';
    }
    if (Object.keys(next).length > 0) {
      setProfileErrors(next);
      return;
    }

    setSavingProfile(true);
    try {
      const updated = await authService.updateProfile({
        username: profileForm.username.trim(),
        email: profileForm.email.trim(),
      });
      // Update local storage in case username changed
      if (updated.username !== user.username) {
        localStorage.setItem('username', updated.username);
      }
      setProfile({ ...profile, username: updated.username, email: updated.email });
      setEditingProfile(false);
      showToast('Profile updated successfully');
    } catch (err) {
      const data = err.response?.data || {};
      setProfileErrors(data);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPasswordErrors({});

    const next = {};
    if (!passwordForm.current_password) next.current_password = 'Current password is required.';
    if (!passwordForm.new_password) next.new_password = 'New password is required.';
    else if (passwordForm.new_password.length < 8) next.new_password = 'Minimum 8 characters.';
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      next.confirm_password = 'Passwords do not match.';
    }
    if (Object.keys(next).length > 0) {
      setPasswordErrors(next);
      return;
    }

    setSavingPassword(true);
    try {
      await authService.changePassword(passwordForm);
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
      setEditingPassword(false);
      showToast('Password changed successfully');
    } catch (err) {
      const data = err.response?.data || {};
      setPasswordErrors(data);
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) return <LoadingState message="Loading profile..." />;
  if (error || !profile) return <ErrorState message="Could not load profile." onRetry={load} />;

  return (
    <div className="max-w-3xl mx-auto">
      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-md shadow-lg text-white text-sm ${
          toast.type === 'error' ? 'bg-danger' : 'bg-success'
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-primary">Profile</h1>
        <p className="text-sm text-ink-muted">Your account information and activity.</p>
      </div>

      {/* Account info card */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-ink-primary truncate">
                {profile.username}
              </h2>
              <p className="text-sm text-ink-muted">ShortMetric user</p>
            </div>
          </div>
          {!editingProfile && (
            <button
              onClick={() => setEditingProfile(true)}
              className="btn btn-sm btn-outline"
            >
              <Pencil className="w-3.5 h-3.5" /> Edit
            </button>
          )}
        </div>

        {!editingProfile ? (
          <div className="space-y-4">
            <InfoRow icon={User} label="Username" value={profile.username} />
            <InfoRow icon={Mail} label="Email" value={profile.email || 'Not provided'} />
            <InfoRow
              icon={Calendar}
              label="Member since"
              value={new Date(profile.date_joined).toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            />
          </div>
        ) : (
          <form onSubmit={handleProfileSave} className="space-y-4">
            <Input
              id="username"
              label="Username"
              value={profileForm.username}
              onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
              error={profileErrors.username}
            />
            <Input
              id="email"
              type="email"
              label="Email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              error={profileErrors.email}
            />
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                <Save className="w-4 h-4" />
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingProfile(false);
                  setProfileErrors({});
                  setProfileForm({
                    username: profile.username,
                    email: profile.email || '',
                  });
                }}
                className="btn btn-outline"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Password card */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-ink-muted" />
            <h2 className="text-lg font-semibold text-ink-primary">Password</h2>
          </div>
          {!editingPassword && (
            <button
              onClick={() => setEditingPassword(true)}
              className="btn btn-sm btn-outline"
            >
              <Pencil className="w-3.5 h-3.5" /> Change
            </button>
          )}
        </div>

        {!editingPassword ? (
          <p className="text-sm text-ink-muted">
            Keep your account secure. Change your password regularly.
          </p>
        ) : (
          <form onSubmit={handlePasswordSave} className="space-y-4">
            <Input
              id="current_password"
              type="password"
              label="Current password"
              value={passwordForm.current_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
              error={passwordErrors.current_password}
              autoComplete="current-password"
            />
            <Input
              id="new_password"
              type="password"
              label="New password"
              helper="Minimum 8 characters."
              value={passwordForm.new_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
              error={passwordErrors.new_password}
              autoComplete="new-password"
            />
            <Input
              id="confirm_password"
              type="password"
              label="Confirm new password"
              value={passwordForm.confirm_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
              error={passwordErrors.confirm_password}
              autoComplete="new-password"
            />
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={savingPassword}>
                <Save className="w-4 h-4" />
                {savingPassword ? 'Saving...' : 'Change Password'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingPassword(false);
                  setPasswordErrors({});
                  setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
                }}
                className="btn btn-outline"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Activity */}
      {stats && (
        <div>
          <h3 className="text-sm font-semibold uppercase text-ink-muted mb-3">
            Your Activity
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard label="Total Links" value={stats.total_links} icon={Link2} accent="primary" />
            <MetricCard label="Total Clicks" value={stats.total_clicks} icon={MousePointerClick} accent="primary" />
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-md bg-primary-light flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase text-ink-muted">{label}</div>
        <div className="text-ink-primary break-all">{value}</div>
      </div>
    </div>
  );
}
