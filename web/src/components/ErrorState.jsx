import { AlertCircle } from 'lucide-react';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="card text-center py-12 border-danger/30">
      <div className="flex justify-center mb-3">
        <AlertCircle className="w-8 h-8 text-danger" />
      </div>
      <p className="text-ink-secondary mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-outline">
          Try again
        </button>
      )}
    </div>
  );
}
