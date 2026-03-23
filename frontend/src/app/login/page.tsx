'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, AuthError } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { Logo } from '@/components/ui/Logo';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.tasksdone.cloud/api';

async function exchangeFirebaseToken(idToken: string) {
  const res = await fetch(`${API}/auth/firebase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Google sign-in failed');
  }
  return res.json() as Promise<{ user: any; accessToken: string }>;
}

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

const TESTIMONIALS = [
  { text: "TasksDone replaced Asana, Notion, Harvest, and our spreadsheets. We saved $800/mo and 10 hours a week.", author: 'Maria K.', role: 'Agency Owner, Berlin' },
  { text: "The client portal alone is worth it. Clients see progress in real-time. We get fewer update requests.", author: 'James R.', role: 'Creative Director, London' },
];

const STATS = [
  { value: '2,400+', label: 'Agencies' },
  { value: '40+', label: 'Countries' },
  { value: '98.7%', label: 'Uptime' },
];

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, isAuthenticated, accessToken } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const leftPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const e = params.get('error');
      if (e) setError(e);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && accessToken) router.push('/dashboard');
  }, [isAuthenticated, accessToken, router]);

  function handleAfterAuth(user: any, token: string) {
    setAuth(user, token);
    (window as any).__TASKSDONE_AUTH_TOKEN__ = token;
    if (user.onboardingCompleted === false || user.onboarding_completed === false) {
      router.push('/onboarding');
    } else {
      router.push('/dashboard');
    }
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Invalid email or password.');
      handleAfterAuth(data.user, data.accessToken);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError('');
    setGoogleLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const idToken = await cred.user.getIdToken();
      const { user, accessToken: token } = await exchangeFirebaseToken(idToken);
      handleAfterAuth(user, token);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        // User cancelled
      } else {
        setError(err.message || 'Google sign-in failed.');
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div id="auth-layout" style={{ minHeight: '100vh', background: '#060B18', display: 'flex', fontFamily: 'var(--font-inter, Inter), -apple-system, sans-serif' }}>
      {/* Left panel */}
      <div ref={leftPanelRef} className="auth-left-panel" style={{ flex: '0 0 52%', background: 'linear-gradient(135deg, #0A1628 0%, #060B18 100%)', position: 'relative', overflow: 'hidden', padding: '48px', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.05)' }}
        onMouseMove={e => { const rect = leftPanelRef.current?.getBoundingClientRect(); if (rect) setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top }); }}
      >
        {/* Grid bg */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        {/* Cursor glow */}
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)', left: mousePos.x - 200, top: mousePos.y - 200, pointerEvents: 'none', transition: 'left 0.1s, top 0.1s' }} />
        {/* Blue radial glow center */}
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <a href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <Logo size={32} showWordmark />
          </a>
        </div>

        {/* Center content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-outfit, Outfit)', fontSize: 'clamp(28px,3vw,40px)', fontWeight: 900, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 16 }}>
              Welcome back to<br />your agency OS
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>Manage clients, campaigns, and your team — all from one place.</p>
          </div>

          {/* Testimonials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px' }}>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, marginBottom: 10 }}>&ldquo;{t.text}&rdquo;</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#0EA5E9,#2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white' }}>{t.author[0]}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>{t.author}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 32, position: 'relative', zIndex: 2, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: 'var(--font-outfit, Outfit)', fontSize: 22, fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="auth-right-panel" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h1 style={{ fontFamily: 'var(--font-outfit, Outfit)', fontSize: 26, fontWeight: 800, color: 'white', marginBottom: 6, letterSpacing: '-0.02em' }}>Sign in</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>
            Don&apos;t have an account?{' '}
            <a href="/register" style={{ color: '#60a5fa', fontWeight: 600, textDecoration: 'none' }}>Create one free</a>
          </p>

          {/* Google */}
          <button type="button" onClick={handleGoogleLogin} disabled={googleLoading || loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'white', fontSize: 14, fontWeight: 600, cursor: googleLoading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', marginBottom: '1.25rem', boxSizing: 'border-box' }}
            onMouseEnter={e => !googleLoading && (e.currentTarget.style.background = 'rgba(255,255,255,0.09)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
          >
            {googleLoading ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            )}
            {googleLoading ? 'Signing in…' : 'Continue with Google'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Email</label>
              <input type="email" required placeholder="you@agency.com" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '11px 14px', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, color: 'white', fontSize: 14, outline: 'none' }} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Password</label>
                <a href="/forgot-password" style={{ fontSize: 12, color: '#60a5fa', textDecoration: 'none' }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '11px 2.8rem 11px 14px', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, color: 'white', fontSize: 14, outline: 'none' }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0 }}>
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13 }}>{error}</div>
            )}

            <button type="submit" disabled={loading || googleLoading} style={{ marginTop: 4, width: '100%', padding: '13px', background: loading ? 'rgba(37,99,235,0.5)' : 'linear-gradient(135deg,#0EA5E9,#2563EB)', border: 'none', borderRadius: 10, color: 'white', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 20px rgba(37,99,235,0.3)', transition: 'opacity 0.2s' }}>
              {loading && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>}
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    </div>
  );
}
