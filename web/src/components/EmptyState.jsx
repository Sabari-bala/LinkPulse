import { Link } from 'react-router-dom';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'Nothing here yet',
  description,
  actionLabel,
  actionTo,
  icon: Icon = Inbox,
}) {
  return (
    <div className="card text-center py-14 border-dashed">
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center">
          <Icon className="w-7 h-7 text-primary" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-ink-primary mb-1">{title}</h3>
      {description && <p className="text-ink-muted text-sm mb-5">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn btn-primary inline-flex">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
