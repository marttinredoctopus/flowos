interface BadgeProps {
  children: React.ReactNode;
  variant?: 'indigo' | 'violet' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'default';
  dot?: boolean;
  className?: string;
}

const VARIANT_STYLES: Record<string, { bg: string; color: string }> = {
  indigo:  { bg: 'var(--indigo-2)',  color: 'var(--indigo)' },
  violet:  { bg: 'var(--violet-2)',  color: 'var(--violet)' },
  cyan:    { bg: 'var(--cyan-2)',    color: 'var(--cyan)' },
  emerald: { bg: 'var(--emerald-2)', color: 'var(--emerald)' },
  amber:   { bg: 'var(--amber-2)',   color: 'var(--amber)' },
  rose:    { bg: 'var(--rose-2)',    color: 'var(--rose)' },
  default: { bg: 'var(--border)',    color: 'var(--text-2)' },
};

export default function Badge({ children, variant = 'default', dot = false, className = '' }: BadgeProps) {
  const { bg, color } = VARIANT_STYLES[variant] ?? VARIANT_STYLES.default;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${className}`}
      style={{ background: bg, color }}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />}
      {children}
    </span>
  );
}
