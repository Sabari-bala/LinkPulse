import { useState, useEffect, useCallback } from 'react';
import { User, Mail, Calendar, Link2, MousePointerClick } from 'lucide-react';
import { MetricCard, LoadingState, ErrorState } from '../components';
import { authService } from '../services/authService';
import { analyticsService } from '../services/analyticsService';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <LoadingState message="Loading profile..." />;
  if (error || !profile) return <ErrorState message="Could not load profile." onRetry={load} />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-primary">Profile</h1>
        <p className="text-sm text-ink-muted">Your account information and activity.</p>
      </div>

      <div className="card mb-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
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

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-md bg-primary-light flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase text-ink-muted">Username</div>
              <div className="text-ink-primary">{profile.username}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-md bg-primary-light flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase text-ink-muted">Email</div>
              <div className="text-ink-primary break-all">
                {profile.email || 'Not provided'}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-md bg-primary-light flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase text-ink-muted">
                Member since
              </div>
              <div className="text-ink-primary">
                {new Date(profile.date_joined).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {stats && (
        <div>
          <h3 className="text-sm font-semibold uppercase text-ink-muted mb-3">
            Your Activity
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              label="Total Links"
              value={stats.total_links}
              icon={Link2}
              accent="primary"
            />
            <MetricCard
              label="Total Clicks"
              value={stats.total_clicks}
              icon={MousePointerClick}
              accent="primary"
            />
          </div>
        </div>
      )}
    </div>
  );
}
