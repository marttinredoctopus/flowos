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
          (window as any).__FLOWOS_AUTH_TOKEN__ = accessToken;
        }
        set({ user, accessToken, isAuthenticated: true });
      },
      setToken: (accessToken) => {
        if (typeof window !== 'undefined') {
          (window as any).__FLOWOS_AUTH_TOKEN__ = accessToken;
        }
        set({ accessToken });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          (window as any).__FLOWOS_AUTH_TOKEN__ = null;
        }
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'flowos-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken && typeof window !== 'undefined') {
          (window as any).__FLOWOS_AUTH_TOKEN__ = state.accessToken;
        }
      },
    }
  )
);
