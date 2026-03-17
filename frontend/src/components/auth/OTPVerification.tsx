'use client';

import { useState, useEffect, useRef } from 'react';
import apiClient from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';
import { connectSocket } from '@/lib/socket';
import toast from 'react-hot-toast';

interface Props {
  userId: string;
  email: string;
  onVerified: (accessToken: string, user: any) => void;
  onBack?: () => void;
}

export default function OTPVerification({ userId, email, onVerified, onBack }: Props) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(60);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    inputRefs[0].current?.focus();
    const timer = setInterval(() => setCooldown(c => c > 0 ? c - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setError('');
    if (value && index < 5) inputRefs[index + 1].current?.focus();
    if (value && index === 5) {
      const full = [...newDigits.slice(0, 5), value.slice(-1)].join('');
      if (full.length === 6) submitOTP(full);
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      setDigits(paste.split(''));
      inputRefs[5].current?.focus();
      submitOTP(paste);
    }
    e.preventDefault();
  }

  async function submitOTP(code?: string) {
    const otp = code || digits.join('');
    if (otp.length !== 6) { setError('Please enter the 6-digit code'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.post('/auth/verify-email', { userId, otp });
      const { accessToken, user } = res.data;
      useAuthStore.getState().setAuth(user, accessToken);
      connectSocket(accessToken, user.id);
      toast.success('Email verified! Welcome to TasksDone 🚀');
      onVerified(accessToken, user);
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Invalid code. Try again.';
      setError(msg);
      setDigits(['', '', '', '', '', '']);
      inputRefs[0].current?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (cooldown > 0) return;
    try {
      await apiClient.post('/auth/resend-verification', { userId });
      setCooldown(60);
      toast.success('New code sent to ' + email);
    } catch {
      toast.error('Failed to resend. Please try again.');
    }
  }

  const inputStyle = (filled: boolean, hasError: boolean): React.CSSProperties => ({
    width: 48,
    height: 58,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 700,
    background: filled ? 'var(--purple-dim)' : 'var(--input-bg)',
    border: `2px solid ${hasError ? 'var(--red)' : filled ? 'var(--purple)' : 'var(--border)'}`,
    borderRadius: 10,
    color: 'var(--text)',
    outline: 'none',
    transition: 'all 0.15s',
    caretColor: 'var(--purple)',
    fontFamily: 'JetBrains Mono, monospace',
  });

  return (
    <div style={{ textAlign: 'center', padding: '32px' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>📬</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>
        Check your email
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
        We sent a 6-digit code to<br />
        <strong style={{ color: 'var(--text)' }}>{email}</strong>
      </p>

      {/* OTP inputs */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={inputRefs[i]}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            onPaste={handlePaste}
            style={inputStyle(!!d, !!error)}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          color: 'var(--red)', fontSize: 13,
          background: 'var(--red-dim)', padding: '8px 14px',
          borderRadius: 8, marginBottom: 16,
          border: '1px solid rgba(239,83,80,0.3)',
        }}>
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={() => submitOTP()}
        disabled={loading || digits.join('').length !== 6}
        style={{
          width: '100%', padding: '13px',
          background: digits.join('').length === 6 ? 'linear-gradient(135deg, #7c6fe0, #4a9eff)' : 'var(--border)',
          color: 'white', border: 'none', borderRadius: 12,
          fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: 16, transition: 'all 0.15s', opacity: loading ? 0.7 : 1,
        }}>
        {loading ? 'Verifying…' : 'Verify Email →'}
      </button>

      {/* Resend */}
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
        Didn't receive the code?{' '}
        <button
          onClick={handleResend}
          disabled={cooldown > 0}
          style={{
            background: 'none', border: 'none',
            color: cooldown > 0 ? 'var(--text-dim)' : 'var(--purple-light)',
            cursor: cooldown > 0 ? 'default' : 'pointer',
            fontSize: 13, fontWeight: 700, padding: 0,
          }}>
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
        </button>
      </p>
      <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>Check your spam folder if you don't see it</p>

      {onBack && (
        <button onClick={onBack} style={{ marginTop: 16, background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}>
          ← Back
        </button>
      )}
    </div>
  );
}
