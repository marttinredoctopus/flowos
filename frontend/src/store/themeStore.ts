import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  toggle: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('light', theme === 'light');
        }
      },
      toggle: () => {
        set((s) => {
          const newTheme = s.theme === 'dark' ? 'light' : 'dark';
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('light', newTheme === 'light');
          }
          return { theme: newTheme };
        });
      },
    }),
    {
      name: 'flowos-theme',
      onRehydrateStorage: () => (state) => {
        if (state?.theme === 'light' && typeof document !== 'undefined') {
          document.documentElement.classList.add('light');
        }
      },
    }
  )
);
