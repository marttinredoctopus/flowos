'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import apiClient from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';

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
  const colors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= score ? colors[score] : 'bg-dark-600'}`} />
        ))}
      </div>
      {password && <p className={`text-xs ${score < 3 ? 'text-slate-400' : 'text-green-400'}`}>{labels[score]}</p>}
    </div>
  );
}

export default function SignupModal({ onClose, onSwitchToLogin }: Props) {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ name: '', email: '', password: '', orgName: '', terms: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const { accessToken, user } = res.data;
      (window as any).__FLOWOS_AUTH_TOKEN__ = accessToken;
      setAuth(user, accessToken);
      setTimeout(async () => {
        try {
          const r = await apiClient.post('/auth/refresh');
          (window as any).__FLOWOS_AUTH_TOKEN__ = r.data.accessToken;
          useAuthStore.getState().setToken(r.data.accessToken);
        } catch {}
      }, 14 * 60 * 1000);
      toast.success('Welcome to FlowOS! 🚀');
      onClose();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-dark-800 border border-white/10 rounded-2xl p-8 animate-slide-up max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="float-right text-slate-400 hover:text-white text-xl">✕</button>
        <h2 className="font-display text-2xl font-bold mb-1">Create your workspace</h2>
        <p className="text-slate-400 text-sm mb-6">Free forever on Starter. No card needed.</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Full name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple/50 transition-colors"
              placeholder="Ahmed Hassan"
              required
              autoComplete="name"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Work email</label>
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
              placeholder="Min. 8 characters"
              required
              autoComplete="new-password"
            />
            <PasswordStrength password={form.password} />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Agency / company name</label>
            <input
              type="text"
              value={form.orgName}
              onChange={(e) => setForm({ ...form, orgName: e.target.value })}
              className="w-full px-4 py-3 bg-dark-700 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple/50 transition-colors"
              placeholder="Acme Digital Agency"
              required
            />
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.terms}
              onChange={(e) => setForm({ ...form, terms: e.target.checked })}
              className="mt-0.5 w-4 h-4 accent-brand-purple"
            />
            <span className="text-sm text-slate-400">
              I agree to the{' '}
              <a href="#" className="text-brand-blue hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-brand-blue hover:underline">Privacy Policy</a>
            </span>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 gradient-bg rounded-xl font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? 'Creating workspace…' : 'Create Free Workspace'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-brand-blue hover:underline font-medium">Sign in</button>
        </p>
      </div>
    </div>
  );
}
