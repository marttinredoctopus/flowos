'use client';
import React from 'react';

interface PageHeroProps {
  badge?: string;
  title: React.ReactNode;
  subtitle?: string;
  cta?: React.ReactNode;
}

export function PageHero({ badge, title, subtitle, cta }: PageHeroProps) {
  return (
    <section style={{
      padding: '120px 24px 80px',
      textAlign: 'center',
      background: 'linear-gradient(180deg, #060B18 0%, #0A1628 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', width: 700, height: 500, borderRadius: '50%', top: -100, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {badge && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 100, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', fontSize: 12, color: '#60a5fa', fontWeight: 600, marginBottom: 20 }}>
            {badge}
          </div>
        )}
        <h1 style={{ fontFamily: 'var(--font-outfit, Outfit)', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-0.03em', color: 'white', marginBottom: 20, lineHeight: 1.1 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.7 }}>
            {subtitle}
          </p>
        )}
        {cta}
      </div>
    </section>
  );
}
