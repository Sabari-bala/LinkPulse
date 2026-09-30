import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Link2, MousePointerClick, CheckCircle2, XCircle } from 'lucide-react';
import {
  MetricCard, LoadingState, ErrorState, EmptyState, Pagination,
  LinkRow, LinkCard, ConfirmDialog, Input,
} from '../components';
import { linksService } from '../services/linksService';
import { analyticsService } from '../services/analyticsService';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  const [links, setLinks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [linksLoading, setLinksLoading] = useState(true);
  const [linksError, setLinksError] = useState(false);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('newest');

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load stats once
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(false);
    try {
      const data = await analyticsService.dashboard();
      setStats(data);
    } catch (err) {
      setStatsError(true);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Load links whenever filters change
  const loadLinks = useCallback(async () => {
    setLinksLoading(true);
    setLinksError(false);
    try {
      const params = { page };
      if (search.trim()) params.search = search.trim();
      if (status) params.status = status;
      if (sort) params.sort = sort;

      const data = await linksService.list(params);
      setLinks(data.results || []);
      setHasNext(!!data.next);
      setHasPrev(!!data.previous);
    } catch (err) {
      setLinksError(true);
    } finally {
      setLinksLoading(false);
    }
  }, [page, search, status, sort]);

  useEffect(() => { loadStats(); }, [loadStats]);

  useEffect(() => {
    // Debounce: wait 300ms after user stops typing
    const timer = setTimeout(() => loadLinks(), 300);
    return () => clearTimeout(timer);
  }, [loadLinks]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, status, sort]);

  const handleDeleteClick = (id) => setConfirmDelete(id);

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await linksService.remove(confirmDelete);
      setConfirmDelete(null);
      // Refresh both stats and links
      loadStats();
      loadLinks();
    } catch (err) {
      // Keep dialog open but show error
      alert('Failed to delete link. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink-primary">Dashboard</h1>
          <p className="text-sm text-ink-muted">
            Track your links and understand their performance.
          </p>
        </div>
        <Link to="/create-link" className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Create Link
        </Link>
      </div>

      {/* Metrics */}
      {statsError ? (
        <ErrorState message="Could not load statistics." onRetry={loadStats} />
      ) : statsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="card p-5 animate-pulse">
              <div className="h-3 w-20 bg-border rounded mb-2" />
              <div className="h-6 w-12 bg-border rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <MetricCard label="Total Links" value={stats?.total_links ?? 0} icon={Link2} accent="primary" />
          <MetricCard label="Total Clicks" value={stats?.total_clicks ?? 0} icon={MousePointerClick} accent="primary" />
          <MetricCard label="Active Links" value={stats?.active_links ?? 0} icon={CheckCircle2} accent="success" />
          <MetricCard label="Expired / Disabled" value={stats?.expired_links ?? 0} icon={XCircle} accent="warning" />
        </div>
      )}

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="label">Search</label>
          <input
            type="text"
            placeholder="Search by short code or URL"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="label">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        <div>
          <label className="label">Sort</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="clicks">Most Clicks</option>
            <option value="least_clicks">Least Clicks</option>
          </select>
        </div>
      </div>

      {/* Links */}
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-ink-primary">My Links</h2>
      </div>

      {linksLoading ? (
        <LoadingState message="Loading your links..." />
      ) : linksError ? (
        <ErrorState message="Failed to load links. Please try again." onRetry={loadLinks} />
      ) : links.length === 0 ? (
        <EmptyState
          title={search || status ? 'No links match your filters' : 'No links yet'}
          description={
            search || status
              ? 'Try adjusting your search or filters.'
              : 'Create your first short link to start tracking clicks.'
          }
          actionLabel="+ Create Link"
          actionTo="/create-link"
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block card p-0 overflow-hidden">
            <table className="w-full">
              <thead className="bg-surface-muted">
                <tr className="text-left text-xs uppercase tracking-wide text-ink-secondary">
                  <th className="p-4 font-semibold">Short URL</th>
                  <th className="p-4 font-semibold">Original URL</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Clicks</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <LinkRow key={link.id} link={link} onDelete={handleDeleteClick} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {links.map((link) => (
              <LinkCard key={link.id} link={link} onDelete={handleDeleteClick} />
            ))}
          </div>
        </>
      )}

      <Pagination
        page={page}
        hasNext={hasNext}
        hasPrev={hasPrev}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete this link?"
        message="This action cannot be undone. The short URL will stop working immediately."
        confirmLabel="Delete Link"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete(null)}
        loading={deleting}
      />
    </div>
  );
}
