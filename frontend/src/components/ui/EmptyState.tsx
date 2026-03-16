export function EmptyState({
  icon,
  title,
  description,
  ctaLabel,
  onCta,
}: {
  icon: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  onCta?: () => void;
}) {
  return (
    <div style={{ textAlign: 'center', padding: '72px 20px' }}>
      <div style={{ fontSize: 52, marginBottom: 16, lineHeight: 1 }}>{icon}</div>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 8, margin: '0 0 8px' }}>{title}</h3>
      {description && (
        <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 360, margin: '0 auto 24px', lineHeight: 1.6 }}>
          {description}
        </p>
      )}
      {ctaLabel && onCta && (
        <button
          onClick={onCta}
          className="gradient-bg"
          style={{
            padding: '10px 24px', borderRadius: 12, fontWeight: 600,
            fontSize: 14, color: '#fff', border: 'none', cursor: 'pointer',
          }}
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
