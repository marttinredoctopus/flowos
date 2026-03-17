import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({ hover = false, padding = 'md', className = '', children, style, ...props }: CardProps) {
  const paddings = { none: '', sm: 'p-3', md: 'p-4', lg: 'p-6' };
  return (
    <div
      className={`card-base ${hover ? 'card-hover-effect' : ''} ${paddings[padding]} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
