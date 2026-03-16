export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '72px 20px' }}>
      <div style={{ fontSize: 44, marginBottom: 16 }}>⚠️</div>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 8, margin: '0 0 8px' }}>
        Something went wrong
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>
        {message || 'An unexpected error occurred.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '8px 20px', borderRadius: 10, fontWeight: 600,
            fontSize: 13, color: 'var(--text-muted)', background: 'transparent',
            border: '1px solid var(--border)', cursor: 'pointer',
          }}
        >
          Try again
        </button>
      )}
    </div>
  );
}
