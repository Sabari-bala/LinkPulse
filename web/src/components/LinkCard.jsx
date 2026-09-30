import { Link } from 'react-router-dom';
import { BarChart3, FileText, Trash2, ExternalLink } from 'lucide-react';
import Badge from './Badge';
import CopyButton from './CopyButton';
import { getShortUrl } from '../lib/shortUrl';

export default function LinkCard({ link, onDelete }) {
  const shortUrl = getShortUrl(link.short_code);
  const status =
    !link.is_active
      ? { label: 'Disabled', variant: 'danger' }
      : link.is_expired
      ? { label: 'Expired', variant: 'warning' }
      : { label: 'Active', variant: 'success' };

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <a href={shortUrl} target="_blank" rel="noreferrer" className="text-primary font-semibold break-all">
          /{link.short_code}
        </a>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div className="text-xs text-ink-muted break-all">{link.original_url}</div>

      <div className="flex items-center justify-between pt-1">
        <div className="text-sm">
          <span className="font-bold text-ink-primary">{link.click_count}</span>{' '}
          <span className="text-ink-muted">clicks</span>
        </div>
        <CopyButton text={shortUrl} />
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
        <Link to={`/analytics/${link.id}`} className="btn btn-sm btn-outline flex-1">
          <BarChart3 className="w-3.5 h-3.5" /> Analytics
        </Link>
        <Link to={`/link-details/${link.id}`} className="btn btn-sm btn-outline flex-1">
          <FileText className="w-3.5 h-3.5" /> Details
        </Link>
        <a href={shortUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline flex-1">
          <ExternalLink className="w-3.5 h-3.5" /> Open
        </a>
        <button onClick={() => onDelete(link.id)} className="btn btn-sm btn-danger-outline flex-1">
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      </div>
    </div>
  );
}
