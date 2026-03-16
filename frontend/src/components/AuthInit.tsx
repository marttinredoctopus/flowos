'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Runs once on app mount. If the user was previously authenticated,
 * silently refreshes the access token using the HttpOnly refresh cookie.
 * This prevents "logged out on refresh" caused by the 15-min token expiry.
 */
export function AuthInit() {
  const { user, isAuthenticated, setToken, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Eagerly refresh so pages never hit 401 on first load
    async function init() {
      try {
        const res = await fetch(`${API}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('refresh failed');
        const data = await res.json();
        const token = data.accessToken || data.data?.accessToken;
        if (token) {
          setToken(token);
          // Schedule next silent refresh 14 min from now (1 min before 15m expiry)
          setTimeout(silentRefresh, 14 * 60 * 1000);
        }
      } catch {
        // Refresh cookie expired / invalid — log user out
        logout();
        window.location.href = '/';
      }
    }

    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

async function silentRefresh() {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
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
      setTimeout(silentRefresh, 14 * 60 * 1000);
    }
  } catch {
    // silent — don't force logout on background refresh failure
  }
}
