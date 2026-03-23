'use client';
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setSent(true); // Don't reveal whether email exists
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
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
          background: '#0f1117', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20, padding: '2.5rem',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(99,102,241,0.15)', border: '2px solid rgba(99,102,241,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '1.3rem', marginBottom: 8 }}>Check your email</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                If an account exists for <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{email}</strong>,
                we&apos;ve sent a password reset link. Check your spam folder too.
              </p>
              <a href="/login" style={{
                display: 'inline-block', padding: '0.75rem 2rem',
                background: 'linear-gradient(135deg,#6366f1,#a855f7)',
                borderRadius: 10, color: '#fff', fontWeight: 600,
                textDecoration: 'none', fontSize: '0.95rem',
              }}>Back to Login</a>
            </div>
          ) : (
            <>
              <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>
                Reset your password
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '2rem' }}>
                Enter your email and we&apos;ll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                    Email address
                  </label>
                  <input
                    type="email" required placeholder="you@company.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    style={{
                      width: '100%', padding: '0.75rem 1rem', boxSizing: 'border-box',
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 10, color: '#fff', fontSize: '0.95rem', outline: 'none',
                    }}
                  />
                </div>

                {error && (
                  <div style={{
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 8, padding: '0.65rem 1rem', color: '#f87171', fontSize: '0.85rem',
                  }}>{error}</div>
                )}

                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '0.875rem',
                  background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg,#6366f1,#a855f7)',
                  border: 'none', borderRadius: 10, color: '#fff',
                  fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  {loading && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  )}
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>

                <a href="/login" style={{
                  textAlign: 'center', fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
                }}>← Back to login</a>
              </form>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
