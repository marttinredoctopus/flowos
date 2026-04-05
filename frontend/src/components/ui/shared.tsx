'use client';
import React from 'react';
import { Sparkle, X, ArrowRight } from '@phosphor-icons/react';

// ─── Loading screen ───────────────────────────────────────────
export function LoadingScreen() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: 'linear-gradient(135deg,#7030EF,#DB1FFF)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'spin 1s linear infinite',
        boxShadow: '0 0 24px rgba(112,48,239,0.35)',
      }}>
        <Sparkle size={20} color="#fff" weight="fill" />
      </div>
      <p style={{ color: 'var(--text-3)', fontSize: 13, fontWeight: 500 }}>Loading…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────
export function EmptyState({
  icon, text, action, onAction,
}: {
  icon: string; text: string; action?: string; onAction?: () => void;
}) {
  return (
    <div style={{ textAlign: 'center', padding: '56px 20px' }}>
      <div style={{
        width: 64, height: 64, borderRadius: 18, margin: '0 auto 16px',
        background: 'linear-gradient(135deg,rgba(112,48,239,0.12),rgba(219,31,255,0.08))',
        border: '1px solid rgba(112,48,239,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28,
      }}>{icon}</div>
      <p style={{ color: 'var(--text-3)', fontSize: 14, marginBottom: 20 }}>{text}</p>
      {action && onAction && (
        <button
          onClick={onAction}
          style={{
            padding: '9px 22px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg,#7030EF,#DB1FFF)',
            color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            boxShadow: '0 4px 16px rgba(112,48,239,0.3)',
            fontFamily: 'inherit',
          }}
        >
          {action} <ArrowRight size={12} weight="bold" />
        </button>
      )}
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────
export function Modal({
  title, children, onClose,
}: {
  title: string; children: React.ReactNode; onClose: () => void;
}) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'var(--card)', border: '1px solid rgba(112,48,239,0.2)', borderRadius: 22,
        padding: 28, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(112,48,239,0.1)',
        animation: 'scaleIn 0.2s cubic-bezier(.16,1,.3,1) both',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-display, "Plus Jakarta Sans"), sans-serif', letterSpacing: '-0.02em' }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)', color: 'var(--text-3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,77,106,0.15)'; e.currentTarget.style.color = '#FF4D6A'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-3)'; }}
          >
            <X size={14} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Form field ──────────────────────────────────────────────
export function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const config: Record<string, [string, string]> = {
    active:    ['rgba(0,229,160,0.12)',   '#00E5A0'],
    completed: ['rgba(112,48,239,0.14)',  '#A580FF'],
    on_hold:   ['rgba(255,181,71,0.12)',  '#FFB547'],
    cancelled: ['rgba(255,77,106,0.12)', '#FF4D6A'],
    planning:  ['rgba(0,212,255,0.12)',   '#00D4FF'],
  };
  const [bg, color] = config[status] || ['rgba(107,114,128,0.12)', '#8585A4'];
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: bg, color, textTransform: 'capitalize', whiteSpace: 'nowrap', letterSpacing: '0.02em' }}>
      {status?.replace('_', ' ')}
    </span>
  );
}

// ─── Priority badge ───────────────────────────────────────────
const PRIORITY_DOT: Record<string, { bg: string; color: string; dot: string }> = {
  urgent: { bg: 'rgba(255,77,106,0.12)',  color: '#FF4D6A', dot: '#FF4D6A' },
  high:   { bg: 'rgba(255,181,71,0.12)',  color: '#FFB547', dot: '#FFB547' },
  medium: { bg: 'rgba(0,212,255,0.12)',   color: '#00D4FF', dot: '#00D4FF' },
  low:    { bg: 'rgba(0,229,160,0.12)',   color: '#00E5A0', dot: '#00E5A0' },
};

export function PriorityBadge({ priority }: { priority: string }) {
  const p = PRIORITY_DOT[priority] || { bg: 'rgba(133,133,164,0.12)', color: '#8585A4', dot: '#8585A4' };
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: p.bg, color: p.color, display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap', textTransform: 'capitalize', letterSpacing: '0.02em' }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: p.dot, flexShrink: 0, boxShadow: `0 0 5px ${p.dot}` }} />
      {priority || 'low'}
    </span>
  );
}

// ─── Input style ─────────────────────────────────────────────
export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 13px',
  background: 'var(--input-bg, rgba(255,255,255,0.04))',
  border: '1px solid var(--input-border, rgba(255,255,255,0.08))',
  borderRadius: 10,
  color: 'var(--text)',
  fontSize: 14,
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

// ─── Helpers ─────────────────────────────────────────────────
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

export function getPriorityColor(priority: string) {
  return (
    { urgent: '#FF4D6A', high: '#FFB547', medium: '#00D4FF', low: '#00E5A0' } as any
  )[priority] || '#8585A4';
}
