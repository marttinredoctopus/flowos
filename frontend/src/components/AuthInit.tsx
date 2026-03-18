'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { connectSocket, disconnectSocket } from '@/lib/socket';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Runs once on app mount. If the user was previously authenticated,
 * silently refreshes the access token using the HttpOnly refresh cookie.
 * After getting a fresh token, connects the global socket singleton.
 */
export function AuthInit() {
  const { user, isAuthenticated, setToken, logout } = useAuthStore();

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
          // Connect global socket with fresh token (only once)
          connectSocket(token, user.id);
          setTimeout(() => silentRefresh(user.id), 14 * 60 * 1000);
        }
      } catch {
        logout();
        disconnectSocket();
        // Don't hard-redirect — stale localStorage will be cleared by logout()
        // and the current page's useEffect will handle navigation if needed
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
      // Reconnect socket with fresh token
      connectSocket(token, userId);
      setTimeout(() => silentRefresh(userId), 14 * 60 * 1000);
    }
  } catch {
    // silent — don't force logout on background refresh failure
  }
}
