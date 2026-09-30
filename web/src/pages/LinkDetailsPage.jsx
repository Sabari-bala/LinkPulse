import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  ArrowLeft, Copy, Check, Save, Trash2, Power, PowerOff, ExternalLink,
  BarChart3, Pencil, X,
} from 'lucide-react';
import { Input, Badge, LoadingState, ErrorState, ConfirmDialog } from '../components';
import { linksService } from '../services/linksService';
import { getShortUrl } from '../lib/shortUrl';

export default function LinkDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ original_url: '', short_code: '', expires_at: '' });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await linksService.get(id);
      setLink(data);
      setForm({
        original_url: data.original_url,
        short_code: data.short_code,
        expires_at: data.expires_at
          ? new Date(data.expires_at).toISOString().slice(0, 16)
          : '',
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  const validate = () => {
    const next = {};
    const url = form.original_url.trim();
    if (!url) {
      next.original_url = 'URL is required.';
    } else {
      try {
        const parsed = new URL(url);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          next.original_url = 'Must start with http:// or https://';
        } else if (!parsed.hostname.includes('.')) {
          next.original_url = 'Invalid domain.';
        }
      } catch {
        next.original_url = 'Invalid URL.';
      }
    }
    if (form.expires_at && new Date(form.expires_at) <= new Date()) {
      next.expires_at = 'Expiration must be in the future.';
    }
    setFormErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        original_url: form.original_url.trim(),
        short_code: form.short_code.trim(),
        expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      };
      const updated = await linksService.update(id, payload);
      setLink(updated);
      setEditing(false);
      showToast('Link updated successfully');
    } catch (err) {
      const data = err.response?.data;
      let msg = 'Failed to update link.';
      if (data?.short_code) {
        msg = Array.isArray(data.short_code) ? data.short_code[0] : data.short_code;
      } else if (data?.original_url) {
        msg = Array.isArray(data.original_url) ? data.original_url[0] : data.original_url;
      }
      setFormErrors({ form: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async () => {
    setToggling(true);
    try {
      const updated = await linksService.update(id, { is_active: !link.is_active });
      setLink(updated);
      showToast(updated.is_active ? 'Link enabled' : 'Link disabled');
    } catch {
      showToast('Failed to update status', 'error');
    } finally {
      setToggling(false);
    }
  };

  const handleCopy = async () => {
    const url = getShortUrl(link.short_code);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await linksService.remove(id);
      navigate('/dashboard');
    } catch {
      showToast('Failed to delete link', 'error');
      setDeleting(false);
    }
  };

  if (loading) return <LoadingState message="Loading link details..." />;
  if (error || !link) return <ErrorState message="Could not load this link." onRetry={load} />;

  const shortUrl = getShortUrl(link.short_code);
  const status = !link.is_active
    ? { label: 'Disabled', variant: 'danger' }
    : link.is_expired
    ? { label: 'Expired', variant: 'warning' }
    : { label: 'Active', variant: 'success' };

  return (
    <div className="max-w-3xl mx-auto">
      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-md shadow-lg text-white text-sm ${
          toast.type === 'error' ? 'bg-danger' : 'bg-success'
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <Link to="/dashboard" className="btn btn-sm btn-outline">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-ink-primary">Link Details</h1>
          <p className="text-sm text-ink-muted">View and manage this short link.</p>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div className="card mb-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-ink-muted mb-2">
          Short URL
        </div>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <a href={shortUrl} target="_blank" rel="noreferrer" className="text-primary font-semibold text-lg break-all">
            {shortUrl}
          </a>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="btn btn-outline btn-sm">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <a href={shortUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
              <ExternalLink className="w-4 h-4" /> Open
            </a>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="card">
          <div className="text-xs font-semibold uppercase text-ink-muted mb-1">Clicks</div>
          <div className="text-3xl font-bold text-ink-primary">{link.click_count}</div>
        </div>
        <div className="card">
          <div className="text-xs font-semibold uppercase text-ink-muted mb-1">Created</div>
          <div className="text-sm text-ink-secondary">{new Date(link.created_at).toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="text-xs font-semibold uppercase text-ink-muted mb-1">Updated</div>
          <div className="text-sm text-ink-secondary">{new Date(link.updated_at).toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="text-xs font-semibold uppercase text-ink-muted mb-1">Expiration</div>
          <div className="text-sm text-ink-secondary">
            {link.expires_at ? new Date(link.expires_at).toLocaleString() : 'No expiration set'}
          </div>
        </div>
      </div>

      <div className="card mb-6 flex items-center gap-6 flex-wrap">
        <div>
          <div className="text-xs font-semibold uppercase text-ink-muted mb-2">QR Code</div>
          <div className="bg-white p-3 border border-border rounded-md inline-block">
            <QRCodeSVG value={shortUrl} size={140} level="M" fgColor="#15152A" />
          </div>
        </div>
        <div className="text-sm text-ink-muted max-w-xs">
          Scan this QR code to open the short link. Works on any phone camera.
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-ink-primary">
            {editing ? 'Edit link' : 'Link information'}
          </h2>
          {!editing && (
            <button onClick={() => setEditing(true)} className="btn btn-sm btn-outline">
              <Pencil className="w-3.5 h-3.5" /> Edit
            </button>
          )}
          {editing && (
            <button onClick={() => { setEditing(false); setFormErrors({}); }} className="btn btn-sm btn-outline">
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
          )}
        </div>

        {!editing ? (
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-xs font-semibold uppercase text-ink-muted mb-1">Original URL</div>
              <div className="text-ink-secondary break-all">{link.original_url}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-ink-muted mb-1">Alias</div>
              <div className="text-ink-secondary">{link.short_code}</div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {formErrors.form && (
              <div className="px-3 py-2 rounded-md bg-danger-light text-danger text-sm">
                {formErrors.form}
              </div>
            )}
            <Input id="original_url" name="original_url" type="url" label="Original URL"
              value={form.original_url} onChange={handleChange} error={formErrors.original_url} />
            <Input id="short_code" name="short_code" label="Alias"
              value={form.short_code} onChange={handleChange} error={formErrors.short_code} />
            <Input id="expires_at" name="expires_at" type="datetime-local" label="Expiration"
              value={form.expires_at} onChange={handleChange} error={formErrors.expires_at} />
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}
      </div>

      <div className="card flex flex-wrap gap-2 justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleToggle} disabled={toggling}
            className={`btn ${link.is_active ? 'btn-outline' : 'btn-primary'}`}>
            {link.is_active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
            {toggling ? 'Updating...' : link.is_active ? 'Disable Link' : 'Enable Link'}
          </button>
          <Link to={`/analytics/${link.id}`} className="btn btn-outline">
            <BarChart3 className="w-4 h-4" /> Analytics
          </Link>
        </div>
        <button onClick={() => setConfirmDelete(true)} className="btn btn-danger-outline">
          <Trash2 className="w-4 h-4" /> Delete Link
        </button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this link?"
        message="This action cannot be undone. The short URL will stop working immediately."
        confirmLabel="Delete Link"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
        loading={deleting}
      />
    </div>
  );
}
