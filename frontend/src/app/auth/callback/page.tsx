'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = params.get('token');
    const error = params.get('error');

    if (error || !token) {
      router.replace(`/?error=${error || 'oauth_failed'}`);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((user) => {
        setAuth(user, token);
        router.replace('/dashboard');
      })
      .catch(() => router.replace('/?error=oauth_failed'));
  }, [params, router, setAuth]);

  return (
    <div className="min-h-screen bg-[#070b0f] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-[#4f8cff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Completing sign in...</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#070b0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#4f8cff] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CallbackInner />
    </Suspense>
  );
}
