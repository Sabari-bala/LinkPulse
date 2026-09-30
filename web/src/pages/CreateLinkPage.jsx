import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Copy, Check, BarChart3, FileText } from 'lucide-react';
import { Input } from '../components';
import { linksService } from '../services/linksService';

const RESERVED_ALIASES = [
  'api', 'admin', 'login', 'register', 'dashboard', 'analytics',
  'profile', 'links', 'create-link', 'link-details', 'static', 'media',
];

export default function CreateLinkPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    original_url: '',
    short_code: '',
    expires_at: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const next = {};

    // URL validation
    const url = form.original_url.trim();
    if (!url) {
      next.original_url = 'Destination URL is required.';
    } else {
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          next.original_url = 'URL must start with http:// or https://';
        } else if (!parsed.hostname.includes('.')) {
          next.original_url = 'URL must include a valid domain (e.g., example.com)';
        }
      } catch {
        next.original_url = 'Please enter a valid URL (e.g., https://example.com)';
      }
    }

    // Alias validation
    const alias = form.short_code.trim();
    if (alias) {
      if (!/^[a-zA-Z0-9]+$/.test(alias)) {
        next.short_code = 'Alias can only contain letters and numbers.';
      } else if (alias.length < 3) {
        next.short_code = 'Alias must be at least 3 characters.';
      } else if (alias.length > 30) {
        next.short_code = 'Alias must be at most 30 characters.';
      } else if (RESERVED_ALIASES.includes(alias.toLowerCase())) {
        next.short_code = 'This alias is reserved. Please choose another.';
      }
    }

    // Expiration
    if (form.expires_at) {
      const exp = new Date(form.expires_at);
      if (exp <= new Date()) {
        next.expires_at = 'Expiration must be in the future.';
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        original_url: form.original_url.trim(),
      };
      if (form.short_code.trim()) payload.short_code = form.short_code.trim();
      if (form.expires_at) payload.expires_at = new Date(form.expires_at).toISOString();

      const data = await linksService.create(payload);
      setCreated(data);
    } catch (err) {
      const data = err.response?.data;
      let serverError = 'Failed to create link. Please try again.';
      if (data) {
        if (data.original_url) {
          serverError = Array.isArray(data.original_url)
            ? data.original_url[0]
            : data.original_url;
        } else if (data.short_code) {
          serverError = Array.isArray(data.short_code)
            ? data.short_code[0]
            : data.short_code;
        } else if (data.detail) {
          serverError = data.detail;
        }
      }
      setErrors({ form: serverError });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = async () => {
    if (!created) return;
    const url = `${window.location.origin}/${created.short_code}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const handleCreateAnother = () => {
    setCreated(null);
    setForm({ original_url: '', short_code: '', expires_at: '' });
    setErrors({});
  };

  // ---- Success state ----
  if (created) {
    const shortUrl = `${window.location.origin}/${created.short_code}`;
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center py-10">
          <div className="w-14 h-14 mx-auto rounded-full bg-success-light flex items-center justify-center mb-4">
            <Check className="w-7 h-7 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-ink-primary mb-1">
            Your link is ready!
          </h2>
          <p className="text-sm text-ink-muted mb-6">
            Copy and share it anywhere.
          </p>

          <div className="bg-surface-muted border border-border rounded-md p-4 mb-6 flex items-center justify-between gap-3 flex-wrap">
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary font-semibold break-all text-left"
            >
              {shortUrl}
            </a>
            <button onClick={handleCopy} className="btn btn-outline btn-sm">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="text-xs text-ink-muted mb-6 break-all">
            <span className="font-semibold">Original:</span> {created.original_url}
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <button onClick={handleCreateAnother} className="btn btn-outline">
              <PlusCircle className="w-4 h-4" /> Create Another
            </button>
            <Link to={`/analytics/${created.id}`} className="btn btn-primary">
              <BarChart3 className="w-4 h-4" /> View Analytics
            </Link>
            <Link to={`/link-details/${created.id}`} className="btn btn-outline">
              <FileText className="w-4 h-4" /> Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---- Form state ----
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-primary">Create a short link</h1>
        <p className="text-sm text-ink-muted">
          Shorten any URL, optionally customize the alias, and start tracking clicks.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4" noValidate>
        {errors.form && (
          <div className="px-3 py-2 rounded-md bg-danger-light text-danger text-sm">
            {errors.form}
          </div>
        )}

        <Input
          id="original_url"
          name="original_url"
          type="url"
          label="Destination URL"
          placeholder="https://example.com/your-page"
          value={form.original_url}
          onChange={handleChange}
          error={errors.original_url}
          autoFocus
        />

        <Input
          id="short_code"
          name="short_code"
          label="Custom alias (optional)"
          placeholder="my-link"
          value={form.short_code}
          onChange={handleChange}
          error={errors.short_code}
          helper="Letters and numbers only. 3-30 characters. Leave blank to auto-generate."
        />

        <Input
          id="expires_at"
          name="expires_at"
          type="datetime-local"
          label="Expiration (optional)"
          value={form.expires_at}
          onChange={handleChange}
          error={errors.expires_at}
          helper="The link stops redirecting after this date."
        />

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="btn btn-primary flex-1"
            disabled={submitting}
          >
            {submitting ? 'Creating...' : 'Create Link'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn btn-outline"
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
