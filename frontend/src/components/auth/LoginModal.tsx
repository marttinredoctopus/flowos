'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import apiClient from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';
import { connectSocket } from '@/lib/socket';

interface Props {
  onClose: () => void;
  onSwitchToSignup: () => void;
}

function OtpVerifyStep({ userId, email, onVerified }: { userId: string; email: string; onVerified: () => void }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
                useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  function handleInput(i: number, val: string) {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp]; next[i] = val.slice(-1); setOtp(next);
    if (val && i < 5) refs[i + 1].current?.focus();
  }
  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs[i - 1].current?.focus();
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) { setError('Enter the 6-digit code'); return; }
    setLoading(true); setError('');
    try {
      const res = await apiClient.post('/auth/verify-email', { userId, otp: code });
      const { accessToken, user } = res.data;
      (window as any).__TASKSDONE_AUTH_TOKEN__ = accessToken;
      useAuthStore.getState().setAuth(user, accessToken);
      toast.success(`Welcome back, ${user.name}!`);
      onVerified();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid code. Try again.');
    } finally { setLoading(false); }
  }

  async function handleResend() {
    setResending(true);
    try {
      await apiClient.post('/auth/resend-verification', { userId });
      toast.success('New code sent!');
      setOtp(['', '', '', '', '', '']);
      refs[0].current?.focus();
    } catch { toast.error('Failed to resend'); } finally { setResending(false); }
  }

  return (
    <div>
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">📧</div>
        <h2 className="font-display text-xl font-bold text-white mb-1">Verify your email</h2>
        <p className="text-slate-400 text-sm">We sent a code to <strong className="text-white">{email}</strong></p>
      </div>
      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
      <form onSubmit={handleVerify}>
        <div className="flex gap-2 justify-center mb-6">
          {otp.map((digit, i) => (
            <input key={i} ref={refs[i]} type="text" inputMode="numeric" maxLength={1} value={digit}
              onChange={e => handleInput(i, e.target.value)} onKeyDown={e => handleKeyDown(i, e)}
              className="w-11 h-14 text-center text-xl font-bold bg-dark-700 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-blue transition-colors" />
          ))}
        </div>
        <button type="submit" disabled={loading || otp.join('').length !== 6}
          className="w-full py-3 gradient-bg rounded-xl font-semibold text-white hover:opacity-90 transition disabled:opacity-60">
          {loading ? 'Verifying…' : 'Verify & Sign In'}
        </button>
      </form>
      <p className="text-center text-sm text-slate-400 mt-4">
        <button onClick={handleResend} disabled={resending} className="text-brand-blue hover:underline disabled:opacity-50">
          {resending ? 'Sending…' : 'Resend code'}
        </button>
      </p>
    </div>
  );
}

function ForgotPasswordFlow({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<'email' | 'otp' | 'newpass' | 'done'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [tempToken, setTempToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
                useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('');
    try {
      await apiClient.post('/auth/forgot-password', { email });
      setStep('otp');
    } catch { setStep('otp'); } finally { setLoading(false); }
  }

  function handleOtpInput(i: number, val: string) {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp]; next[i] = val.slice(-1); setOtp(next);
    if (val && i < 5) refs[i + 1].current?.focus();
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) { setError('Enter the 6-digit code'); return; }
    setLoading(true); setError('');
    try {
      const res = await apiClient.post('/auth/verify-reset-otp', { email, otp: code });
      setTempToken(res.data.tempToken);
      setStep('newpass');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid code');
    } finally { setLoading(false); }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('');
    try {
      await apiClient.post('/auth/reset-password', { tempToken, newPassword });
      setStep('done');
      toast.success('Password reset successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Reset failed');
    } finally { setLoading(false); }
  }

  return (
    <div>
      <button onClick={onBack} className="text-brand-blue text-sm mb-4 hover:underline">← Back to login</button>
      <h2 className="font-display text-2xl font-bold mb-1">Reset password</h2>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {step === 'email' && (
        <>
          <p className="text-slate-400 text-sm mb-6">Enter your email and we'll send a 6-digit reset code.</p>
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple/50"
              placeholder="you@agency.com" />
            <button type="submit" disabled={loading} className="w-full py-3 gradient-bg rounded-xl font-semibold hover:opacity-90 disabled:opacity-60">
              {loading ? 'Sending…' : 'Send Reset Code'}
            </button>
          </form>
        </>
      )}

      {step === 'otp' && (
        <>
          <p className="text-slate-400 text-sm mb-6">We sent a 6-digit code to <strong className="text-white">{email}</strong>.</p>
          <form onSubmit={handleVerifyOtp}>
            <div className="flex gap-2 justify-center mb-6">
              {otp.map((digit, i) => (
                <input key={i} ref={refs[i]} type="text" inputMode="numeric" maxLength={1} value={digit}
                  onChange={e => handleOtpInput(i, e.target.value)}
                  onKeyDown={e => { if (e.key === 'Backspace' && !otp[i] && i > 0) refs[i-1].current?.focus(); }}
                  className="w-11 h-14 text-center text-xl font-bold bg-dark-700 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-blue" />
              ))}
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 gradient-bg rounded-xl font-semibold hover:opacity-90 disabled:opacity-60">
              {loading ? 'Verifying…' : 'Verify Code'}
            </button>
          </form>
        </>
      )}

      {step === 'newpass' && (
        <>
          <p className="text-slate-400 text-sm mb-6">Enter your new password.</p>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={8}
              className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple/50"
              placeholder="New password (min. 8 chars)" />
            <button type="submit" disabled={loading} className="w-full py-3 gradient-bg rounded-xl font-semibold hover:opacity-90 disabled:opacity-60">
              {loading ? 'Saving…' : 'Set New Password'}
            </button>
          </form>
        </>
      )}

      {step === 'done' && (
        <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
          ✓ Password updated! <button onClick={onBack} className="text-brand-blue underline ml-1">Sign in</button>
        </div>
      )}
    </div>
  );
}

export default function LoginModal({ onClose, onSwitchToSignup }: Props) {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [otpStep, setOtpStep] = useState<{ userId: string; email: string } | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', form);
      if (!res.data.emailVerified) {
        setOtpStep({ userId: res.data.userId, email: form.email });
        return;
      }
      const { accessToken, user } = res.data;
      (window as any).__TASKSDONE_AUTH_TOKEN__ = accessToken;
      setAuth(user, accessToken);
      connectSocket(accessToken, user.id);
      setTimeout(async () => {
        try {
          const r = await apiClient.post('/auth/refresh');
          (window as any).__TASKSDONE_AUTH_TOKEN__ = r.data.accessToken;
          useAuthStore.getState().setToken(r.data.accessToken);
        } catch {}
      }, 14 * 60 * 1000);
      toast.success(`Welcome back, ${user.name}!`);
      onClose();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleVerified() {
    onClose();
    router.push('/dashboard');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-dark-800 border border-white/10 rounded-2xl p-8 animate-slide-up relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl">✕</button>

        {otpStep ? (
          <OtpVerifyStep userId={otpStep.userId} email={otpStep.email} onVerified={handleVerified} />
        ) : showForgot ? (
          <ForgotPasswordFlow onBack={() => setShowForgot(false)} />
        ) : (
          <>
            <h2 className="font-display text-2xl font-bold mb-1">Welcome back</h2>
            <p className="text-slate-400 text-sm mb-6">Sign in to your TasksDone workspace</p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple/50 transition-colors"
                  placeholder="you@agency.com" required autoComplete="email" />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Password</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple/50 transition-colors"
                  placeholder="••••••••" required autoComplete="current-password" />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                  <input type="checkbox" checked={form.rememberMe} onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })}
                    className="w-4 h-4 accent-brand-purple" />
                  Remember me for 30 days
                </label>
                <button type="button" onClick={() => setShowForgot(true)} className="text-sm text-brand-blue hover:underline">
                  Forgot password?
                </button>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 gradient-bg rounded-xl font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60">
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-400 mt-6">
              No account?{' '}
              <button onClick={onSwitchToSignup} className="text-brand-blue hover:underline font-medium">Start for free</button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
