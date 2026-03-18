'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  withCredentials: true,
});

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, isAuthenticated, accessToken } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Only redirect if we have a live in-memory token (not just a stale persisted flag)
  useEffect(() => {
    if (isAuthenticated && accessToken) router.push('/dashboard');
  }, [isAuthenticated, accessToken, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth(data.user, data.accessToken);
      (window as any).__TASKSDONE_AUTH_TOKEN__ = data.accessToken;
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#07080f', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter',-apple-system,sans-serif", padding: '1rem',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <a href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg,#6366f1,#a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', fontWeight: 800, color: '#fff',
            }}>T</div>
            <span style={{
              fontWeight: 800, fontSize: '1.4rem',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>TasksDone</span>
          </a>
        </div>

        <div style={{
          background: '#0f1117',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20, padding: '2.5rem',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}>
          <h1 style={{
            color: '#fff', fontSize: '1.5rem', fontWeight: 700,
            marginBottom: 8, textAlign: 'center',
          }}>Sign in to your workspace</h1>
          <p style={{
            color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem',
            textAlign: 'center', marginBottom: '2rem',
          }}>
            Don't have an account?{' '}
            <a href="/register" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>
              Create one free
            </a>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                Email
              </label>
              <input
                type="email" required placeholder="you@company.com"
                value={email} onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem 1rem', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, color: '#fff', fontSize: '0.95rem', outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} required placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem 2.8rem 0.75rem 1rem', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10, color: '#fff', fontSize: '0.95rem', outline: 'none',
                  }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'transparent', border: 'none',
                  color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0,
                }}>
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 8, padding: '0.65rem 1rem', color: '#f87171', fontSize: '0.85rem',
              }}>{error}</div>
            )}

            <button type="submit" disabled={loading} style={{
              marginTop: '0.5rem', width: '100%', padding: '0.875rem',
              background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg,#6366f1,#a855f7)',
              border: 'none', borderRadius: 10, color: '#fff',
              fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'opacity 0.2s',
            }}>
              {loading && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </svg>
              )}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
