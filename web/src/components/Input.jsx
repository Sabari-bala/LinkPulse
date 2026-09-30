export default function Input({
  label,
  error,
  helper,
  id,
  className = '',
  ...props
}) {
  return (
    <div className={className}>
      {label && <label htmlFor={id} className="label">{label}</label>}
      <input id={id} className={`input ${error ? 'border-danger' : ''}`} {...props} />
      {helper && !error && <p className="text-xs text-ink-muted mt-1">{helper}</p>}
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  );
}
