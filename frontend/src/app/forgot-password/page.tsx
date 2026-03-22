'use client';
import { useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.tasksdone.cloud/api',
  withCredentials: true,
});

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'new' | 'done'>('email');
  const [otp, setOtp] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setMsg('Check your email for the reset code.');
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send code.');
    } finally { setLoading(false); }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-reset-otp', { email, otp });
      setTempToken(data.tempToken);
      setStep('new');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid or expired code.');
    } finally { setLoading(false); }
  }

  async function resetPass(e: React.FormEvent) {
    e.preventDefault();
    if (newPass !== confirmPass) { setError('Passwords do not match.'); return; }
    setError(''); setLoading(true);
    try {
      await api.post('/auth/reset-password', { tempToken, newPassword: newPass });
      setStep('done');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reset password.');
    } finally { setLoading(false); }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, color: '#fff', fontSize: '0.95rem', outline: 'none',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: 6, fontSize: '0.82rem',
    color: 'rgba(255,255,255,0.6)', fontWeight: 500,
  };
  const btnStyle: React.CSSProperties = {
    width: '100%', padding: '0.875rem',
    background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg,#6366f1,#a855f7)',
    border: 'none', borderRadius: 10, color: '#fff',
    fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
    marginTop: '0.5rem',
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#07080f', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter',-apple-system,sans-serif", padding: '1rem',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <a href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, color: '#fff' }}>T</div>
            <span style={{ fontWeight: 800, fontSize: '1.4rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TasksDone</span>
          </a>
        </div>

        <div style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '2.5rem', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>
          {step === 'done' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>Password reset!</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: 24 }}>You can now sign in with your new password.</p>
              <a href="/login" style={{ display: 'inline-block', padding: '0.875rem 2rem', background: 'linear-gradient(135deg,#6366f1,#a855f7)', borderRadius: 10, color: '#fff', fontWeight: 700, textDecoration: 'none' }}>Sign In →</a>
            </div>
          ) : (
            <>
              <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>
                {step === 'email' ? 'Forgot password?' : step === 'otp' ? 'Enter the code' : 'Set new password'}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '2rem' }}>
                {step === 'email' ? "We'll send a reset code to your email." :
                 step === 'otp' ? `Code sent to ${email}` : 'Choose a strong password.'}
              </p>

              {msg && <div style={{ background: 'rgba(74,158,255,0.1)', border: '1px solid rgba(74,158,255,0.3)', borderRadius: 8, padding: '0.65rem 1rem', color: '#4a9eff', fontSize: '0.85rem', marginBottom: 16 }}>{msg}</div>}
              {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '0.65rem 1rem', color: '#f87171', fontSize: '0.85rem', marginBottom: 16 }}>{error}</div>}

              {step === 'email' && (
                <form onSubmit={sendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" style={inputStyle} />
                  </div>
                  <button type="submit" disabled={loading} style={btnStyle}>{loading ? 'Sending…' : 'Send Reset Code'}</button>
                  <p style={{ textAlign: 'center', marginTop: 8 }}><a href="/login" style={{ color: '#818cf8', fontSize: '0.875rem', textDecoration: 'none' }}>← Back to login</a></p>
                </form>
              )}

              {step === 'otp' && (
                <form onSubmit={verifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>6-digit code</label>
                    <input type="text" required maxLength={6} placeholder="123456" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,''))} style={{ ...inputStyle, textAlign: 'center', fontSize: '1.5rem', letterSpacing: 8 }} />
                  </div>
                  <button type="submit" disabled={loading || otp.length < 6} style={btnStyle}>{loading ? 'Verifying…' : 'Verify Code'}</button>
                  <p style={{ textAlign: 'center', marginTop: 4, fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>Didn't receive it? <button onClick={() => { setStep('email'); setMsg(''); setOtp(''); }} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: '0.8rem' }}>Resend</button></p>
                </form>
              )}

              {step === 'new' && (
                <form onSubmit={resetPass} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>New Password</label>
                    <input type="password" required minLength={8} placeholder="••••••••" value={newPass} onChange={e => setNewPass(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Confirm Password</label>
                    <input type="password" required minLength={8} placeholder="••••••••" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} style={inputStyle} />
                  </div>
                  <button type="submit" disabled={loading} style={btnStyle}>{loading ? 'Updating…' : 'Reset Password'}</button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
