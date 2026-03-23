'use client';
import React from 'react';

// ─── Loading screen ───────────────────────────────────────────
export function LoadingScreen() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--border)', borderTop: '3px solid #6366f1', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────
export function EmptyState({ icon, text, action, onAction }: { icon: string; text: string; action?: string; onAction?: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 20 }}>{text}</p>
      {action && onAction && (
        <button onClick={onAction} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          {action}
        </button>
      )}
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────
export function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 22, lineHeight: 1 }}>×</button>
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
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Status badge ────────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const config: Record<string, [string, string]> = {
    active:    ['rgba(34,197,94,0.15)',  '#22c55e'],
    completed: ['rgba(99,102,241,0.15)', '#818cf8'],
    on_hold:   ['rgba(245,158,11,0.15)', '#f59e0b'],
    cancelled: ['rgba(239,68,68,0.15)',  '#ef4444'],
    planning:  ['rgba(6,182,212,0.15)',  '#06b6d4'],
  };
  const [bg, color] = config[status] || ['rgba(107,114,128,0.15)', '#6b7280'];
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: bg, color, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
      {status?.replace('_', ' ')}
    </span>
  );
}

// ─── Priority badge ──────────────────────────────────────────
export function PriorityBadge({ priority }: { priority: string }) {
  const config: Record<string, [string, string, string]> = {
    urgent: ['rgba(239,68,68,0.15)',  '#ef4444', '🔴'],
    high:   ['rgba(245,158,11,0.15)', '#f59e0b', '🟠'],
    medium: ['rgba(99,102,241,0.15)', '#818cf8', '🟡'],
    low:    ['rgba(34,197,94,0.15)',  '#22c55e', '🟢'],
  };
  const [bg, color, emoji] = config[priority] || ['rgba(107,114,128,0.15)', '#6b7280', '⚪'];
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: bg, color }}>
      {emoji} {priority}
    </span>
  );
}

// ─── Input style ─────────────────────────────────────────────
export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  background: 'var(--input-bg, var(--card))',
  border: '1px solid var(--input-border, var(--border))',
  borderRadius: 8,
  color: 'var(--text)',
  fontSize: 14,
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
};

// ─── Helpers ─────────────────────────────────────────────────
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

export function getPriorityColor(priority: string) {
  return ({ urgent: '#ef4444', high: '#f59e0b', medium: '#6366f1', low: '#22c55e' } as any)[priority] || '#6b7280';
}
