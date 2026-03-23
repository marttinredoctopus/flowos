'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { Logo } from '@/components/ui/Logo';
import { CheckCircle } from '@phosphor-icons/react';

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
    throw new Error(data.error || 'Google sign-up failed');
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

const FEATURES = [
  { text: 'Tasks, projects, and Kanban boards' },
  { text: 'Client portal — branded and white-label ready' },
  { text: 'Time tracking and professional invoicing' },
  { text: 'Content calendar for all social platforms' },
  { text: 'Ad campaign tracker (Meta, Google, TikTok)' },
  { text: 'AI-powered campaign and content tools' },
];

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (password.length === 0) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score: 1, label: 'Weak', color: '#f43f5e' };
  if (score <= 2) return { score: 2, label: 'Fair', color: '#f59e0b' };
  if (score <= 3) return { score: 3, label: 'Good', color: '#0EA5E9' };
  return { score: 4, label: 'Strong', color: '#10b981' };
}

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth, isAuthenticated, accessToken } = useAuthStore();
  const [name, setName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && accessToken) router.push('/onboarding');
  }, [isAuthenticated, accessToken, router]);

  function handleAfterAuth(user: any, token: string) {
    setAuth(user, token);
    (window as any).__TASKSDONE_AUTH_TOKEN__ = token;
    router.push('/onboarding');
  }

  async function handleEmailRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password, orgName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Registration failed.');
      handleAfterAuth(data.user, data.accessToken);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleRegister() {
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
        setError(err.message || 'Google sign-up failed.');
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  const pwStrength = getPasswordStrength(password);

  return (
    <div style={{ minHeight: '100vh', background: '#060B18', display: 'flex', fontFamily: 'var(--font-inter, Inter), -apple-system, sans-serif' }}>
      {/* Left panel — features */}
      <div style={{ flex: '0 0 44%', background: 'linear-gradient(135deg, #0A1628 0%, #060B18 100%)', position: 'relative', overflow: 'hidden', padding: '48px', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Grid bg */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <a href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <Logo size={32} showWordmark />
          </a>
        </div>

        {/* Center content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontFamily: 'var(--font-outfit, Outfit)', fontSize: 'clamp(24px,2.5vw,34px)', fontWeight: 900, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 10 }}>
            Everything your agency needs
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 32, lineHeight: 1.6 }}>One platform. No juggling 6 tools.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle size={16} weight="duotone" color="#0EA5E9" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badge */}
        <div style={{ position: 'relative', zIndex: 2, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ fontSize: 22, flexShrink: 0 }}>🔒</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 4 }}>Your data is safe with us</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, margin: 0 }}>AES-256 encrypted. Hosted on AWS. GDPR compliant. You own your data — export it anytime.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h1 style={{ fontFamily: 'var(--font-outfit, Outfit)', fontSize: 24, fontWeight: 800, color: 'white', marginBottom: 6, letterSpacing: '-0.02em' }}>Start your free trial</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#60a5fa', fontWeight: 600, textDecoration: 'none' }}>Sign in</a>
          </p>

          {/* Google */}
          <button type="button" onClick={handleGoogleRegister} disabled={googleLoading || loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'white', fontSize: 14, fontWeight: 600, cursor: googleLoading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', marginBottom: '1.25rem', boxSizing: 'border-box' }}
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
            {googleLoading ? 'Creating account…' : 'Continue with Google'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>or register with email</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <form onSubmit={handleEmailRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {[
              { label: 'Full Name', type: 'text', placeholder: 'Alex Johnson', value: name, onChange: (v: string) => setName(v), required: true },
              { label: 'Agency / Company Name', type: 'text', placeholder: 'Acme Marketing Agency', value: orgName, onChange: (v: string) => setOrgName(v), required: true },
              { label: 'Email', type: 'email', placeholder: 'you@agency.com', value: email, onChange: (v: string) => setEmail(v), required: true },
            ].map(field => (
              <div key={field.label}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{field.label}</label>
                <input type={field.type} required={field.required} placeholder={field.placeholder} value={field.value} onChange={e => field.onChange(e.target.value)} style={{ width: '100%', padding: '11px 14px', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, color: 'white', fontSize: 14, outline: 'none' }} />
              </div>
            ))}

            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} required placeholder="••••••••" minLength={8} value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '11px 2.8rem 11px 14px', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, color: 'white', fontSize: 14, outline: 'none' }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0 }}>
                  <EyeIcon open={showPass} />
                </button>
              </div>
              {password.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                    {[1, 2, 3, 4].map(s => (
                      <div key={s} style={{ flex: 1, height: 3, borderRadius: 3, background: s <= pwStrength.score ? pwStrength.color : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: pwStrength.color }}>{pwStrength.label}</span>
                </div>
              )}
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13 }}>{error}</div>
            )}

            <button type="submit" disabled={loading || googleLoading} style={{ marginTop: 4, width: '100%', padding: '13px', background: loading ? 'rgba(37,99,235,0.5)' : 'linear-gradient(135deg,#0EA5E9,#2563EB)', border: 'none', borderRadius: 10, color: 'white', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 20px rgba(37,99,235,0.3)', transition: 'opacity 0.2s' }}>
              {loading && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>}
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>
              Free 14-day trial · No credit card required
            </p>

            <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.2)', lineHeight: 1.6 }}>
              By signing up you agree to our{' '}
              <a href="/terms" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Terms of Service</a> and{' '}
              <a href="/privacy" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Privacy Policy</a>.
            </p>
          </form>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    </div>
  );
}
