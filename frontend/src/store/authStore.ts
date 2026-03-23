import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  orgId: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken) => {
        if (typeof window !== 'undefined') {
          (window as any).__TASKSDONE_AUTH_TOKEN__ = accessToken;
          // Set session indicator cookie for middleware (frontend domain)
          const secure = location.protocol === 'https:' ? '; Secure' : '';
          document.cookie = `td_session=1; path=/; max-age=${30 * 24 * 3600}; SameSite=Lax${secure}`;
        }
        set({ user, accessToken, isAuthenticated: true });
      },
      setToken: (accessToken) => {
        if (typeof window !== 'undefined') {
          (window as any).__TASKSDONE_AUTH_TOKEN__ = accessToken;
        }
        set({ accessToken });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          (window as any).__TASKSDONE_AUTH_TOKEN__ = null;
          // Clear session indicator cookie
          document.cookie = 'td_session=; path=/; max-age=0';
        }
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'tasksdone-auth',
      // Only persist user identity + auth flag — NOT the access token
      // Access token lives in memory only; AuthInit refreshes it on every page load
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
