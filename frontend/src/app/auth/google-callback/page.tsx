'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

function GoogleCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = params.get('token');
    const error = params.get('error');

    if (error || !token) {
      const messages: Record<string, string> = {
        google_not_configured: 'Google login is not configured yet.',
        google_denied: 'Google login was cancelled.',
        google_no_email: 'Could not get email from Google.',
        account_suspended: 'Your account has been suspended.',
        google_failed: 'Google login failed. Please try again.',
      };
      router.replace(`/login?error=${encodeURIComponent(messages[error || ''] || 'Google login failed.')}`);
      return;
    }

    const user = {
      id:    params.get('id') || '',
      orgId: params.get('orgId') || '',
      name:  params.get('name') || '',
      email: params.get('email') || '',
      role:  params.get('role') || 'admin',
    };

    setAuth(user, token);
    (window as any).__TASKSDONE_AUTH_TOKEN__ = token;
    router.replace('/dashboard');
  }, []);

  return (
    <div style={{
      minHeight: '100vh', background: '#07080f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter',-apple-system,sans-serif",
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          border: '3px solid #6366f1', borderTopColor: 'transparent',
          animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
        }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Signing you in with Google…</p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#07080f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid #6366f1', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    }>
      <GoogleCallbackInner />
    </Suspense>
  );
}
