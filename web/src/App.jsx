import { useAuth } from './hooks/useAuth'

export default function App() {
  const { user, isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card max-w-md text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">ShortMetric</h1>
        <p className="text-ink-secondary mb-4">Short links. Clear insights.</p>
        {isAuthenticated ? (
          <p className="text-sm text-success">
            Logged in as <strong>{user.username}</strong>
          </p>
        ) : (
          <p className="text-sm text-ink-muted">Not logged in</p>
        )}
      </div>
    </div>
  )
}
