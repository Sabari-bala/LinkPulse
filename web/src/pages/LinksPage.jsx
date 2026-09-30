import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, SortAsc } from 'lucide-react';
import {
  LoadingState, ErrorState, EmptyState, Pagination,
  LinkRow, LinkCard, ConfirmDialog,
} from '../components';
import { linksService } from '../services/linksService';

export default function LinksPage() {
  const [links, setLinks] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('newest');

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadLinks = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const params = { page };
      if (search.trim()) params.search = search.trim();
      if (status) params.status = status;
      if (sort) params.sort = sort;

      const data = await linksService.list(params);
      setLinks(data.results || []);
      setCount(data.count || 0);
      setHasNext(!!data.next);
      setHasPrev(!!data.previous);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, search, status, sort]);

  useEffect(() => {
    const timer = setTimeout(() => loadLinks(), 300);
    return () => clearTimeout(timer);
  }, [loadLinks]);

  useEffect(() => {
    setPage(1);
  }, [search, status, sort]);

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await linksService.remove(confirmDelete);
      setConfirmDelete(null);
      loadLinks();
    } catch {
      alert('Failed to delete link. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('');
    setSort('newest');
  };

  const hasActiveFilters = search || status || sort !== 'newest';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink-primary">Links</h1>
          <p className="text-sm text-ink-muted">
            {count > 0 ? `${count} ${count === 1 ? 'link' : 'links'} in your account` : 'Manage all your short links'}
          </p>
        </div>
        <Link to="/create-link" className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Create Link
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[220px]">
            <label className="label flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" /> Search
            </label>
            <input
              type="text"
              placeholder="Search by short code or URL"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
            />
          </div>
          <div className="min-w-[140px]">
            <label className="label flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> Status
            </label>
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
          <div className="min-w-[160px]">
            <label className="label flex items-center gap-1.5">
              <SortAsc className="w-3.5 h-3.5" /> Sort
            </label>
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
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="btn btn-outline"
              type="button"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState message="Loading links..." />
      ) : error ? (
        <ErrorState message="Failed to load links." onRetry={loadLinks} />
      ) : links.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? 'No links match your filters' : 'No links yet'}
          description={
            hasActiveFilters
              ? 'Try adjusting your search or filters.'
              : 'Create your first short link to get started.'
          }
          actionLabel={hasActiveFilters ? undefined : '+ Create Link'}
          actionTo={hasActiveFilters ? undefined : '/create-link'}
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
                  <LinkRow key={link.id} link={link} onDelete={setConfirmDelete} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {links.map((link) => (
              <LinkCard key={link.id} link={link} onDelete={setConfirmDelete} />
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
