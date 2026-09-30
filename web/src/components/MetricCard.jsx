export default function MetricCard({ label, value, icon: Icon, accent = 'primary' }) {
  const accents = {
    primary: 'text-primary bg-primary-light',
    success: 'text-success bg-success-light',
    warning: 'text-warning bg-warning-light',
    danger: 'text-danger bg-danger-light',
  };

  return (
    <div className="card p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition">
      {Icon && (
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${accents[accent]}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          {label}
        </div>
        <div className="text-2xl font-bold text-ink-primary leading-tight">
          {value}
        </div>
      </div>
    </div>
  );
}
