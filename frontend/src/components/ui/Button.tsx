import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'secondary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  children,
  disabled,
  className = '',
  style,
  ...props
}, ref) => {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const sizes = {
    sm: 'h-7 px-3 text-xs rounded-md',
    md: 'h-9 px-4 text-sm rounded-lg',
    lg: 'h-11 px-6 text-sm rounded-xl',
  };

  const variants: Record<string, { style: React.CSSProperties; className: string }> = {
    primary: {
      style: { background: 'var(--grad-primary)', color: '#fff', boxShadow: '0 2px 8px rgba(99,102,241,0.35)' },
      className: 'hover:opacity-90 focus:ring-indigo-500/50',
    },
    secondary: {
      style: { background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' },
      className: 'hover:border-[var(--border-hover)] hover:bg-[var(--card-hover)] focus:ring-[var(--border-focus)]',
    },
    ghost: {
      style: { background: 'transparent', color: 'var(--text-2)' },
      className: 'hover:bg-[var(--nav-hover-bg)] hover:text-[var(--text)] focus:ring-[var(--border-focus)]',
    },
    danger: {
      style: { background: 'var(--rose-2)', color: 'var(--rose)', border: '1px solid transparent' },
      className: 'hover:opacity-90 focus:ring-rose-500/50',
    },
    success: {
      style: { background: 'var(--emerald-2)', color: 'var(--emerald)', border: '1px solid transparent' },
      className: 'hover:opacity-90 focus:ring-emerald-500/50',
    },
  };

  const v = variants[variant];

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${v.className} ${className}`}
      style={{ ...v.style, ...style }}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {children}
      {iconRight && !loading && iconRight}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
