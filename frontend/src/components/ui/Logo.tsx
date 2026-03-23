'use client';
import React from 'react';

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0EA5E9" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="logoGradLight" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="1" stopColor="#60A5FA" />
        </linearGradient>
      </defs>
      {/* Shield shape */}
      <path
        d="M20 2L4 8v10c0 9.4 6.8 18.2 16 20 9.2-1.8 16-10.6 16-20V8L20 2z"
        fill="url(#logoGrad)"
      />
      {/* Checkmark */}
      <path
        d="M13 20l5 5 9-10"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ size = 32, showWordmark = true, className }: LogoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }} className={className}>
      <LogoMark size={size} />
      {showWordmark && (
        <span style={{
          fontWeight: 800,
          fontSize: size * 0.56,
          letterSpacing: '-0.03em',
          color: 'var(--text)',
          lineHeight: 1,
        }}>
          Tasks<span style={{
            background: 'linear-gradient(135deg, #0EA5E9, #2563EB)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Done</span>
        </span>
      )}
    </div>
  );
}

export default Logo;
