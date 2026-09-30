import { Link } from 'react-router-dom';
import { BarChart3, FileText, Trash2, ExternalLink } from 'lucide-react';
import Badge from './Badge';
import CopyButton from './CopyButton';
import { getShortUrl } from '../lib/shortUrl';

export default function LinkRow({ link, onDelete }) {
  const shortUrl = getShortUrl(link.short_code);
  const status =
    !link.is_active
      ? { label: 'Disabled', variant: 'danger' }
      : link.is_expired
      ? { label: 'Expired', variant: 'warning' }
      : { label: 'Active', variant: 'success' };

  return (
    <tr className="border-b border-border last:border-0 hover:bg-surface-hover transition">
      <td className="p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="text-primary font-semibold hover:underline break-all"
            title={shortUrl}
          >
            /{link.short_code}
          </a>
          <CopyButton text={shortUrl} />
        </div>
      </td>
      <td className="p-4 max-w-xs">
        <div className="text-ink-secondary text-sm truncate" title={link.original_url}>
          {link.original_url}
        </div>
      </td>
      <td className="p-4">
        <Badge variant={status.variant}>{status.label}</Badge>
      </td>
      <td className="p-4 text-sm font-semibold text-ink-primary">
        {link.click_count}
      </td>
      <td className="p-4">
        <div className="flex items-center gap-1.5">
          <Link to={`/analytics/${link.id}`} className="btn btn-sm btn-outline" title="Analytics">
            <BarChart3 className="w-3.5 h-3.5" />
          </Link>
          <Link to={`/link-details/${link.id}`} className="btn btn-sm btn-outline" title="Details">
            <FileText className="w-3.5 h-3.5" />
          </Link>
          <a href={shortUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline" title="Open">
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => onDelete(link.id)}
            className="btn btn-sm btn-danger-outline"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
