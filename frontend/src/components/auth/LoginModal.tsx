'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import apiClient from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';

interface Props {
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export default function LoginModal({ onClose, onSwitchToSignup }: Props) {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', form);
      const { accessToken, user } = res.data;
      (window as any).__FLOWOS_AUTH_TOKEN__ = accessToken;
      setAuth(user, accessToken);
      // Auto-refresh before expiry (15min - 1min = 14min)
      setTimeout(async () => {
        try {
          const r = await apiClient.post('/auth/refresh');
          (window as any).__FLOWOS_AUTH_TOKEN__ = r.data.accessToken;
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

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/auth/forgot-password', { email: forgotEmail });
      setForgotSent(true);
    } catch {
      setForgotSent(true); // Always show success
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-dark-800 border border-white/10 rounded-2xl p-8 animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl">✕</button>

        {!showForgot ? (
          <>
            <h2 className="font-display text-2xl font-bold mb-1">Welcome back</h2>
            <p className="text-slate-400 text-sm mb-6">Sign in to your FlowOS workspace</p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple/50 transition-colors"
                  placeholder="you@agency.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple/50 transition-colors"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.rememberMe}
                    onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })}
                    className="w-4 h-4 accent-brand-purple"
                  />
                  Remember me for 30 days
                </label>
                <button type="button" onClick={() => setShowForgot(true)} className="text-sm text-brand-blue hover:underline">
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 gradient-bg rounded-xl font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-400 mt-6">
              No account?{' '}
              <button onClick={onSwitchToSignup} className="text-brand-blue hover:underline font-medium">
                Start for free
              </button>
            </p>
          </>
        ) : (
          <>
            <button onClick={() => setShowForgot(false)} className="text-brand-blue text-sm mb-4 hover:underline">← Back to login</button>
            <h2 className="font-display text-2xl font-bold mb-1">Reset password</h2>
            {forgotSent ? (
              <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                ✓ If that email is registered, you'll receive a reset link shortly. Check your inbox.
              </div>
            ) : (
              <>
                <p className="text-slate-400 text-sm mb-6">Enter your email and we'll send a reset link.</p>
                <form onSubmit={handleForgot} className="space-y-4">
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple/50"
                    placeholder="you@agency.com"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 gradient-bg rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    {loading ? 'Sending…' : 'Send Reset Link'}
                  </button>
                </form>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
