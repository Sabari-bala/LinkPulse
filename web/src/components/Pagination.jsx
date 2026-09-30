export default function Pagination({ page, hasNext, hasPrev, onPrev, onNext }) {
  if (!hasNext && !hasPrev) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        className="btn btn-outline btn-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span className="text-sm text-ink-muted">Page {page}</span>
      <button
        onClick={onNext}
        disabled={!hasNext}
        className="btn btn-outline btn-sm disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
