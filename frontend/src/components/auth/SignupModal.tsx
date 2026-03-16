'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import apiClient from '@/lib/apiClient';
import OTPVerification from './OTPVerification';

interface Props {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#ef5350', '#ffc107', '#4a9eff', '#4caf82'];
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{
            height: 3, flex: 1, borderRadius: 99,
            background: i <= score ? colors[score] : 'var(--border)',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>
      {password && <p style={{ fontSize: 11, color: score < 3 ? 'var(--text-muted)' : '#4caf82' }}>{labels[score]}</p>}
    </div>
  );
}

export default function SignupModal({ onClose, onSwitchToLogin }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [form, setForm] = useState({ name: '', email: '', password: '', orgName: '', terms: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.terms) { setError('Please accept the terms to continue.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        orgName: form.orgName,
      });
      setUserId(res.data.userId);
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleVerified(accessToken: string, user: any) {
    onClose();
    // New users always go through onboarding first
    router.push('/onboarding');
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    background: 'var(--input-bg)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    fontSize: 16,
    outline: 'none',
    fontFamily: 'inherit',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
    }} className="animate-fade-in">
      <div style={{
        width: '100%', maxWidth: 440,
        background: 'var(--card)',
        border: '1px solid var(--border-hover)',
        borderRadius: 20,
        maxHeight: '90vh',
        overflowY: 'auto',
      }} className="animate-slide-up">

        {step === 'otp' ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 16px 0' }}>
              <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>
            <OTPVerification
              userId={userId}
              email={form.email}
              onVerified={handleVerified}
              onBack={() => setStep('form')}
            />
          </>
        ) : (
          <div style={{ padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: 'var(--text)' }}>Create your workspace</h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Free forever on Starter. No card needed.</p>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>

            {error && (
              <div style={{
                marginBottom: 16, padding: '10px 14px',
                borderRadius: 10, background: 'var(--red-dim)',
                border: '1px solid rgba(239,83,80,0.3)',
                color: 'var(--red)', fontSize: 13,
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>Full name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  style={inputStyle} placeholder="Ahmed Hassan" required autoComplete="name" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>Work email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  style={inputStyle} placeholder="you@agency.com" required autoComplete="email" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>Password</label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  style={inputStyle} placeholder="Min. 8 characters" required autoComplete="new-password" />
                <PasswordStrength password={form.password} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-muted)' }}>Agency / company name</label>
                <input type="text" value={form.orgName} onChange={e => setForm({ ...form, orgName: e.target.value })}
                  style={inputStyle} placeholder="Acme Digital Agency" required />
              </div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.terms} onChange={e => setForm({ ...form, terms: e.target.checked })}
                  style={{ marginTop: 2, width: 16, height: 16, accentColor: 'var(--purple)' }} />
                <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  I agree to the{' '}
                  <a href="#" style={{ color: 'var(--purple-light)' }}>Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" style={{ color: 'var(--purple-light)' }}>Privacy Policy</a>
                </span>
              </label>
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '13px',
                background: 'linear-gradient(135deg, #7c6fe0, #4a9eff)',
                color: 'white', border: 'none', borderRadius: 12,
                fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1, marginTop: 4,
              }}>
                {loading ? 'Creating workspace…' : 'Create Free Workspace →'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 20 }}>
              Already have an account?{' '}
              <button onClick={onSwitchToLogin} style={{ background: 'none', border: 'none', color: 'var(--purple-light)', fontWeight: 700, cursor: 'pointer', fontSize: 13, padding: 0 }}>
                Sign in
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
