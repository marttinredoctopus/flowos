export function Avatar({ name, size = 32, title, className }: {
  name: string;
  size?: number;
  title?: string;
  className?: string;
}) {
  const initials = name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '?';
  const palette = ['#7c6fe0','#4a9eff','#ff6b9d','#00c9b1','#ffc107','#4caf82','#ef5350','#ff7043'];
  const bg = name ? palette[name.charCodeAt(0) % palette.length] : '#7b7fa8';
  return (
    <div
      className={className}
      title={title || name}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: bg, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: Math.floor(size * 0.38),
        fontWeight: 700, color: '#fff', flexShrink: 0, userSelect: 'none',
      }}
    >
      {initials}
    </div>
  );
}
