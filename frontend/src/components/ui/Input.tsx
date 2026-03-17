import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  icon,
  iconRight,
  className = '',
  style,
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold" style={{ color: 'var(--text-2)' }}>
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 flex items-center" style={{ color: 'var(--text-3)' }}>
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={`w-full h-9 text-sm input-base px-3 ${icon ? 'pl-9' : ''} ${iconRight ? 'pr-9' : ''} ${className}`}
          style={{ color: 'var(--text)', ...style }}
          {...props}
        />
        {iconRight && (
          <span className="absolute right-3 flex items-center" style={{ color: 'var(--text-3)' }}>
            {iconRight}
          </span>
        )}
      </div>
      {error && <p className="text-xs" style={{ color: 'var(--rose)' }}>{error}</p>}
      {hint && !error && <p className="text-xs" style={{ color: 'var(--text-3)' }}>{hint}</p>}
    </div>
  );
});

Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  className = '',
  style,
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold" style={{ color: 'var(--text-2)' }}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={`w-full text-sm input-base px-3 py-2.5 resize-none ${className}`}
        style={{ color: 'var(--text)', ...style }}
        {...props}
      />
      {error && <p className="text-xs" style={{ color: 'var(--rose)' }}>{error}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Input;
