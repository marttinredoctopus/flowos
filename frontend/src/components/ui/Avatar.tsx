const GRADIENTS = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #06b6d4, #6366f1)',
  'linear-gradient(135deg, #10b981, #06b6d4)',
  'linear-gradient(135deg, #f59e0b, #f43f5e)',
  'linear-gradient(135deg, #8b5cf6, #f43f5e)',
  'linear-gradient(135deg, #10b981, #6366f1)',
];

function getGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

/** Backwards-compatible Avatar used across the app */
export function Avatar({
  name,
  size = 32,
  title,
  className,
  src,
}: {
  name: string;
  size?: number;
  title?: string;
  className?: string;
  src?: string;
}) {
  const initials = name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '?';

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        title={title || name}
        className={className}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      />
    );
  }

  return (
    <div
      className={className}
      title={title || name}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: name ? getGradient(name) : 'var(--text-3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: Math.floor(size * 0.38),
        fontWeight: 700,
        color: '#fff',
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {initials}
    </div>
  );
}

export default Avatar;
