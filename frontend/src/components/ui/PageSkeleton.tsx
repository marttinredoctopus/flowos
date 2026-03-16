export function PageSkeleton({ rows = 5, cards = 4 }: { rows?: number; cards?: number }) {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ height: 28, width: 180, background: 'var(--card)', borderRadius: 8, marginBottom: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: 16, width: 120, background: 'var(--card)', borderRadius: 6, marginBottom: 28, animation: 'pulse 1.5s ease-in-out infinite', opacity: 0.6 }} />
      {cards > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(cards, 4)}, 1fr)`, gap: 12, marginBottom: 24 }}>
          {Array.from({ length: cards }).map((_, i) => (
            <div key={i} style={{
              height: 96, background: 'var(--card)', borderRadius: 16,
              animation: 'pulse 1.5s ease-in-out infinite',
              animationDelay: `${i * 0.1}s`,
            }} />
          ))}
        </div>
      )}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{
          height: 52, background: 'var(--card)', borderRadius: 12, marginBottom: 8,
          animation: 'pulse 1.5s ease-in-out infinite',
          animationDelay: `${i * 0.07}s`,
          opacity: 1 - i * 0.12,
        }} />
      ))}
    </div>
  );
}
