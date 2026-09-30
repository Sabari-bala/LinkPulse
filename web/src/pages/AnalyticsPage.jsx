import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  MousePointerClick, Link2, CheckCircle2, XCircle, ArrowLeft, BarChart3,
} from 'lucide-react';
import {
  MetricCard, LoadingState, ErrorState, EmptyState, Badge,
} from '../components';
import { analyticsService } from '../services/analyticsService';

const CHART_COLORS = ['#5B4AEF', '#7C6FF2', '#16A34A', '#D97706', '#DC2626', '#2563EB', '#6B6F82'];

export default function AnalyticsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const result = id
        ? await analyticsService.forLink(id)
        : await analyticsService.dashboard();
      setData(result);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <LoadingState message="Loading analytics..." />;
  if (error || !data) return <ErrorState message="Could not load analytics." onRetry={load} />;

  return id ? <LinkAnalytics data={data} /> : <OverallAnalytics data={data} />;
}

// ---------- Overall analytics (no specific link) ----------
function OverallAnalytics({ data }) {
  const clicksOverTime = (data.clicks_over_time || []).map((d) => ({
    date: d.date,
    clicks: d.count,
  }));

  const hasClicks = data.total_clicks > 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-primary">Analytics</h1>
        <p className="text-sm text-ink-muted">
          Overview of all your links and click activity.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total Links" value={data.total_links} icon={Link2} accent="primary" />
        <MetricCard label="Total Clicks" value={data.total_clicks} icon={MousePointerClick} accent="primary" />
        <MetricCard label="Active Links" value={data.active_links} icon={CheckCircle2} accent="success" />
        <MetricCard label="Expired / Disabled" value={data.expired_links} icon={XCircle} accent="warning" />
      </div>

      {!hasClicks ? (
        <EmptyState
          title="No clicks yet"
          description="Share your links to start collecting analytics."
          actionLabel="View Dashboard"
          actionTo="/dashboard"
          icon={BarChart3}
        />
      ) : (
        <>
          <div className="card mb-6">
            <h2 className="text-lg font-semibold text-ink-primary mb-4">
              Clicks over time (last 14 days)
            </h2>
            {clicksOverTime.length === 0 ? (
              <p className="text-sm text-ink-muted">No data yet.</p>
            ) : (
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <LineChart data={clicksOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EF" />
                    <XAxis dataKey="date" stroke="#6B6F82" fontSize={12} />
                    <YAxis stroke="#6B6F82" fontSize={12} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: '1px solid #E5E7EF',
                        boxShadow: '0 4px 12px rgba(21,21,42,0.06)',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="clicks"
                      stroke="#5B4AEF"
                      strokeWidth={2}
                      dot={{ fill: '#5B4AEF', r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {data.top_links && data.top_links.length > 0 && (
            <div className="card mb-6">
              <h2 className="text-lg font-semibold text-ink-primary mb-4">
                Top performing links
              </h2>
              <div className="space-y-2">
                {data.top_links.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <Link
                      to={`/analytics/${link.id}`}
                      className="text-primary font-semibold hover:underline"
                    >
                      /{link.short_code}
                    </Link>
                    <span className="text-sm text-ink-muted">
                      {link.click_count} {link.click_count === 1 ? 'click' : 'clicks'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.recent_clicks && data.recent_clicks.length > 0 && (
            <RecentClicksTable clicks={data.recent_clicks} showLink />
          )}
        </>
      )}
    </div>
  );
}

// ---------- Per-link analytics ----------
function LinkAnalytics({ data }) {
  const link = data.link;
  const clicksOverTime = (data.clicks_over_time || []).map((d) => ({
    date: d.date,
    clicks: d.count,
  }));

  const deviceData = (data.device_breakdown || []).map((d) => ({
    name: d.device_category || 'Unknown',
    value: d.count,
  }));

  const browserData = (data.browser_breakdown || []).map((d) => ({
    name: d.browser || 'Unknown',
    value: d.count,
  }));

  const osData = (data.os_breakdown || []).map((d) => ({
    name: d.operating_system || 'Unknown',
    value: d.count,
  }));

  const referrerData = (data.referrer_breakdown || [])
    .filter((d) => d.referrer)
    .map((d) => ({ name: d.referrer, value: d.count }))
    .slice(0, 8);

  const status = !link.is_active
    ? { label: 'Disabled', variant: 'danger' }
    : 'Active';

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/dashboard" className="btn btn-sm btn-outline">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-ink-primary">
            Analytics for /{link.short_code}
          </h1>
          <p className="text-sm text-ink-muted break-all">{link.original_url}</p>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total Clicks" value={data.total_clicks} icon={MousePointerClick} accent="primary" />
      </div>

      {data.total_clicks === 0 ? (
        <EmptyState
          title="No clicks yet"
          description="Share this link and your first click will appear here."
          actionLabel="Back to Dashboard"
          actionTo="/dashboard"
          icon={BarChart3}
        />
      ) : (
        <>
          <div className="card mb-6">
            <h2 className="text-lg font-semibold text-ink-primary mb-4">
              Clicks over time
            </h2>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <LineChart data={clicksOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EF" />
                  <XAxis dataKey="date" stroke="#6B6F82" fontSize={12} />
                  <YAxis stroke="#6B6F82" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: '1px solid #E5E7EF',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#5B4AEF"
                    strokeWidth={2}
                    dot={{ fill: '#5B4AEF', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <BreakdownCard title="Devices" data={deviceData} type="pie" />
            <BreakdownCard title="Browsers" data={browserData} type="bar" />
            <BreakdownCard title="Operating Systems" data={osData} type="bar" />
            {referrerData.length > 0 && (
              <BreakdownCard title="Referrers" data={referrerData} type="bar" />
            )}
          </div>

          <RecentClicksTable clicks={data.recent_clicks} />
        </>
      )}
    </div>
  );
}

// ---------- Small sub-components ----------
function BreakdownCard({ title, data, type = 'bar' }) {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h3 className="text-sm font-semibold text-ink-primary mb-4">{title}</h3>
        <p className="text-sm text-ink-muted">No data.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-ink-primary mb-4">{title}</h3>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          {type === 'pie' ? (
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EF' }}
              />
            </PieChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EF" vertical={false} />
              <XAxis dataKey="name" stroke="#6B6F82" fontSize={11} />
              <YAxis stroke="#6B6F82" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EF' }}
              />
              <Bar dataKey="value" fill="#5B4AEF" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function RecentClicksTable({ clicks, showLink = false }) {
  if (!clicks || clicks.length === 0) return null;
  return (
    <div className="card p-0 overflow-hidden">
      <div className="p-5 border-b border-border">
        <h2 className="text-lg font-semibold text-ink-primary">Recent Clicks</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-muted">
            <tr className="text-left text-xs uppercase tracking-wide text-ink-secondary">
              <th className="p-3 font-semibold">Time</th>
              {showLink && <th className="p-3 font-semibold">Link</th>}
              <th className="p-3 font-semibold">Browser</th>
              <th className="p-3 font-semibold">Device</th>
              <th className="p-3 font-semibold">OS</th>
              <th className="p-3 font-semibold">Referrer</th>
            </tr>
          </thead>
          <tbody>
            {clicks.map((c) => (
              <tr key={c.id} className="border-t border-border hover:bg-surface-hover">
                <td className="p-3 text-ink-secondary whitespace-nowrap">
                  {new Date(c.clicked_at).toLocaleString()}
                </td>
                {showLink && (
                  <td className="p-3 text-primary font-semibold">
                    /{c.link__short_code}
                  </td>
                )}
                <td className="p-3 text-ink-secondary">{c.browser || '—'}</td>
                <td className="p-3 text-ink-secondary">{c.device_category || '—'}</td>
                <td className="p-3 text-ink-secondary">{c.operating_system || '—'}</td>
                <td className="p-3 text-ink-secondary truncate max-w-xs">
                  {c.referrer || 'Direct'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
