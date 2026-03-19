'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { connectSocket, disconnectSocket } from '@/lib/socket';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Public routes that don't require onboarding redirect
const PUBLIC_PATHS = ['/', '/login', '/register', '/signup', '/forgot-password', '/reset-password', '/onboarding'];

export function AuthInit() {
  const { user, isAuthenticated, setToken, setAuth, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    async function init() {
      try {
        const res = await fetch(`${API}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('refresh failed');
        const data = await res.json();
        const token = data.accessToken || data.data?.accessToken;
        if (token && user) {
          setToken(token);
          connectSocket(token, user.id);
          setTimeout(() => silentRefresh(user.id), 14 * 60 * 1000);
        }

        // Check onboarding status — only redirect from dashboard
        if (pathname?.startsWith('/dashboard')) {
          const meRes = await fetch(`${API}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (meRes.ok) {
            const me = await meRes.json();
            if (me.onboarding_completed === false) {
              router.replace('/onboarding');
            }
          }
        }
      } catch {
        logout();
        disconnectSocket();
      }
    }

    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

async function silentRefresh(userId: string) {
  try {
    const res = await fetch(`${API}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) return;
    const data = await res.json();
    const token = data.accessToken || data.data?.accessToken;
    if (token) {
      useAuthStore.getState().setToken(token);
      connectSocket(token, userId);
      setTimeout(() => silentRefresh(userId), 14 * 60 * 1000);
    }
  } catch {
    // silent
  }
}
