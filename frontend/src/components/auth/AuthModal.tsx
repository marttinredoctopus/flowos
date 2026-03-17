'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  withCredentials: true,
});

interface Props {
  initialMode?: 'login' | 'signup';
  mode?: 'login' | 'signup';
  onClose: () => void;
  onSwitch?: (m: 'login' | 'signup') => void;
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function AuthModal({ initialMode, mode: modeProp, onClose, onSwitch }: Props) {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const resolvedInitial = modeProp ?? initialMode ?? 'login';
  const [mode, setMode] = useState<'login' | 'signup'>(resolvedInitial);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const { data } = await api.post('/auth/login', { email, password });
        setAuth(data.user, data.accessToken);
        (window as any).__TASKSDONE_AUTH_TOKEN__ = data.accessToken;
        router.push('/dashboard');
      } else {
        await api.post('/auth/register', { name, email, password });
        // After registration, log in automatically
        const { data } = await api.post('/auth/login', { email, password });
        setAuth(data.user, data.accessToken);
        (window as any).__TASKSDONE_AUTH_TOKEN__ = data.accessToken;
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(7,8,15,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: '#0f1117',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          position: 'relative',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            background: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
            lineHeight: 1, fontSize: '1.25rem', padding: '4px',
          }}
        >✕</button>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            fontWeight: 700, fontSize: '1.3rem', color: '#fff',
          }}>
            <span style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.9rem',
            }}>F</span>
            TasksDone
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', background: 'rgba(255,255,255,0.04)',
          borderRadius: 10, padding: '4px', marginBottom: '2rem',
        }}>
          {(['login', 'signup'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); onSwitch?.(m); }}
              style={{
                flex: 1, padding: '0.55rem', border: 'none', cursor: 'pointer',
                borderRadius: 8, fontSize: '0.9rem', fontWeight: 600,
                transition: 'all 0.2s',
                background: mode === m ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'transparent',
                color: mode === m ? '#fff' : 'rgba(255,255,255,0.5)',
              }}
            >
              {m === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'signup' && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem 1rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, color: '#fff', fontSize: '0.95rem',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
              Email
            </label>
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, color: '#fff', fontSize: '0.95rem',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem 2.8rem 0.75rem 1rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, color: '#fff', fontSize: '0.95rem',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'transparent', border: 'none',
                  color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0,
                }}
              >
                <EyeIcon open={showPass} />
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 8, padding: '0.65rem 1rem', color: '#f87171', fontSize: '0.85rem',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              width: '100%', padding: '0.85rem',
              background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #a855f7)',
              border: 'none', borderRadius: 10,
              color: '#fff', fontSize: '1rem', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              transition: 'opacity 0.2s',
            }}
          >
            {loading && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </svg>
            )}
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { const next = mode === 'login' ? 'signup' : 'login'; setMode(next); setError(''); onSwitch?.(next); }}
            style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontWeight: 600, fontSize: 'inherit' }}
          >
            {mode === 'login' ? 'Create one free' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
