'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';

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

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, isAuthenticated, accessToken } = useAuthStore();
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPass, setShowPass]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError]               = useState('');
  const [focused, setFocused]           = useState('');
  const [mousePos, setMousePos]         = useState({ x: 0, y: 0 });
  const leftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const e = new URLSearchParams(window.location.search).get('error');
      if (e) setError(e);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && accessToken) router.push('/dashboard');
  }, [isAuthenticated, accessToken, router]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      const rect = leftRef.current?.getBoundingClientRect();
      if (rect) setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);

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
    setError(''); setLoading(true);
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
    } finally { setLoading(false); }
  }

  async function handleGoogleLogin() {
    setError(''); setGoogleLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const idToken = await cred.user.getIdToken();
      const { user, accessToken: token } = await exchangeFirebaseToken(idToken);
      handleAfterAuth(user, token);
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setError(err.message || 'Google sign-in failed.');
      }
    } finally { setGoogleLoading(false); }
  }

  const inputStyle = (name: string): React.CSSProperties => ({
    width: '100%', padding: '13px 16px', boxSizing: 'border-box',
    background: focused === name ? 'rgba(37,99,235,0.07)' : 'rgba(255,255,255,0.04)',
    border: `1.5px solid ${focused === name ? 'rgba(37,99,235,0.7)' : 'rgba(255,255,255,0.09)'}`,
    borderRadius: 12, color: 'white', fontSize: 14, fontFamily: 'inherit',
    outline: 'none', transition: 'all 0.2s',
    boxShadow: focused === name ? '0 0 0 4px rgba(37,99,235,0.1)' : 'none',
  });

  const METRICS = [
    { v: '2,400+', l: 'Agencies', c: '#60a5fa' },
    { v: '40+',    l: 'Countries', c: '#a78bfa' },
    { v: '4.9★',   l: 'Rating',    c: '#fbbf24' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#060B18', display: 'flex', fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* ── LEFT PANEL ── */}
      <div ref={leftRef} style={{ flex: '0 0 52%', background: 'linear-gradient(135deg, #080F20 0%, #060B18 100%)', position: 'relative', overflow: 'hidden', padding: '48px', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.05)' }}>

        {/* Grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px)', backgroundSize: '44px 44px', pointerEvents: 'none' }} />
        {/* Cursor glow */}
        <div style={{ position: 'absolute', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.13) 0%, transparent 70%)', left: mousePos.x - 240, top: mousePos.y - 240, pointerEvents: 'none', transition: 'left 0.12s, top 0.12s' }} />
        {/* Static glow */}
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)', top: '35%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#0ea5e9,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 4px 16px rgba(37,99,235,0.4)' }}>✓</div>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 20, color: 'white', letterSpacing: '-0.02em' }}>
              Tasks<span style={{ color: '#60a5fa' }}>Done</span>
            </span>
          </Link>
        </div>

        {/* Center */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ marginBottom: 44 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 12px 5px 6px', background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.25)', borderRadius: 100, marginBottom: 20 }}>
              <span style={{ background: 'linear-gradient(135deg,#0ea5e9,#2563eb)', fontSize: 10, fontWeight: 700, color: 'white', padding: '2px 8px', borderRadius: 100 }}>LIVE</span>
              <span style={{ fontSize: 12, color: '#93c5fd' }}>2,400+ agencies trust TasksDone</span>
            </div>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(26px,3vw,42px)', fontWeight: 900, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.12, marginBottom: 16 }}>
              Welcome back to<br />
              <span style={{ background: 'linear-gradient(135deg,#93c5fd,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>your agency OS</span>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.42)', lineHeight: 1.7, maxWidth: 360 }}>
              Manage clients, campaigns, time tracking, invoicing, and your team — all from one beautifully designed workspace.
            </p>
          </div>

          {/* Testimonials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { quote: '"TasksDone replaced Asana, Notion, Harvest, and our spreadsheets. We saved $800/mo and 10 hours a week."', name: 'Maria K.', role: 'Agency Owner, Berlin', color: '#2563eb' },
              { quote: '"The client portal alone is worth it. Clients see progress in real-time. We get fewer update requests."', name: 'James R.', role: 'Creative Director, London', color: '#8b5cf6' },
            ].map((t, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 18px', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${t.color}40`; e.currentTarget.style.background = `${t.color}06`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                  {[...Array(5)].map((_,j) => <span key={j} style={{ color: '#fbbf24', fontSize: 11 }}>★</span>)}
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.62)', lineHeight: 1.65, marginBottom: 12, fontStyle: 'italic' }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg,${t.color},${t.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0 }}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: 0, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {METRICS.map((m, i) => (
            <div key={m.l} style={{ flex: 1, paddingLeft: i > 0 ? 24 : 0, borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none', marginLeft: i > 0 ? 24 : 0 }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 900, color: m.c, letterSpacing: '-0.02em' }}>{m.v}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{m.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', position: 'relative', overflowY: 'auto' }}>

        {/* Top nav */}
        <div style={{ position: 'absolute', top: 24, right: 32, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>No account?</span>
          <Link href="/register" style={{ fontSize: 13, fontWeight: 700, color: '#60a5fa', textDecoration: 'none', padding: '7px 16px', borderRadius: 8, border: '1px solid rgba(96,165,250,0.25)', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(96,165,250,0.08)'; e.currentTarget.style.borderColor = 'rgba(96,165,250,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(96,165,250,0.25)'; }}>
            Sign up free →
          </Link>
        </div>

        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 32, fontWeight: 900, color: 'white', letterSpacing: '-0.03em', marginBottom: 8 }}>Sign in</h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)' }}>
              Enter your credentials to access your workspace
            </p>
          </div>

          {/* Google button */}
          <button type="button" onClick={handleGoogleLogin} disabled={googleLoading || loading} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            width: '100%', padding: '13px', borderRadius: 12,
            background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)',
            color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.2s', marginBottom: 20, boxSizing: 'border-box', fontFamily: 'inherit',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
          onMouseEnter={e => { if (!googleLoading) { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'none'; }}>
            {googleLoading ? <Spinner /> : (
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            )}
            {googleLoading ? 'Signing in…' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>or sign in with email</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 7, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>Email address</label>
              <input
                type="email" required placeholder="you@agency.com"
                value={email} onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                style={inputStyle('email')}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>Password</label>
                <Link href="/forgot-password" style={{ fontSize: 12, color: '#60a5fa', textDecoration: 'none', fontWeight: 500 }}>Forgot?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} required placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                  style={{ ...inputStyle('password'), paddingRight: 46 }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', padding: 0, display: 'flex', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
                  {showPass ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '11px 14px' }}>
                <span style={{ color: '#f87171', fontSize: 14, flexShrink: 0, marginTop: 1 }}>⚠</span>
                <p style={{ color: '#f87171', fontSize: 13, lineHeight: 1.5, margin: 0 }}>{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading || googleLoading} style={{
              marginTop: 4, width: '100%', padding: '14px',
              background: loading ? 'rgba(37,99,235,0.5)' : 'linear-gradient(135deg,#0ea5e9,#2563eb)',
              border: 'none', borderRadius: 12, color: 'white', fontSize: 15, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 6px 24px rgba(37,99,235,0.35)', transition: 'all 0.2s', fontFamily: 'inherit',
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(37,99,235,0.5)'; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(37,99,235,0.35)'; }}>
              {loading && <Spinner />}
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.18)', marginTop: 24, lineHeight: 1.6 }}>
            By signing in you agree to our{' '}
            <Link href="/terms" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Terms</Link> and{' '}
            <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Privacy Policy</Link>
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        @media (max-width: 768px) {
          div[style*="flex: 0 0 52%"] { display: none !important; }
          div[style*="flex: 1"][style*="alignItems: center"] { padding: 32px 20px !important; }
        }
      `}</style>
    </div>
  );
}
