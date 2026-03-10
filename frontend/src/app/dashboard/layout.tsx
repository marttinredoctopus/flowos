'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import NotificationBell from '@/components/notifications/NotificationBell';

const NAV_SECTIONS = [
  {
    label: 'Workspace',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
      { label: 'Chat', href: '/dashboard/chat', icon: '💬', badge: 10 },
      { label: 'Time Tracking', href: '/dashboard/time-tracking', icon: '⏱️' },
    ],
  },
  {
    label: 'Work',
    items: [
      { label: 'Projects', href: '/dashboard/projects', icon: '📁' },
      { label: 'Tasks', href: '/dashboard/tasks', icon: '✅' },
      { label: 'Clients', href: '/dashboard/clients', icon: '👥' },
      { label: 'Team', href: '/dashboard/team', icon: '👤' },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { label: 'Content Planner', href: '/dashboard/content', icon: '📅' },
      { label: 'Idea Bank', href: '/dashboard/ideas', icon: '💡' },
      { label: 'Ad Campaigns', href: '/dashboard/campaigns', icon: '📢' },
    ],
  },
  {
    label: 'Production',
    items: [
      { label: 'Meetings', href: '/dashboard/meetings', icon: '🎥' },
      { label: 'Shoot Sessions', href: '/dashboard/shoots', icon: '📸' },
    ],
  },
  {
    label: 'Agency',
    items: [
      { label: 'Files', href: '/dashboard/files', icon: '🗂️' },
      { label: 'Reports', href: '/dashboard/reports', icon: '📊' },
      { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      router.replace('/');
    }
  }, [hydrated, isAuthenticated, router]);

  function handleLogout() {
    logout();
    router.replace('/');
  }

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#070b0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const Sidebar = () => (
    <aside className="w-64 flex-shrink-0 flex flex-col h-full bg-[#0f1117] border-r border-white/5">
      {/* Logo */}
      <div className="p-5 border-b border-white/5">
        <div className="font-display font-bold text-xl gradient-text leading-tight">FlowOS</div>
        <div className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase mt-0.5">
          Agency Edition
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase px-4 mb-1 mt-5 first:mt-2">
              {section.label}
            </p>
            {section.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition mx-2 mb-0.5 ${
                    active
                      ? 'bg-white/10 text-white border-l-2 border-brand-blue pl-[14px]'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge ? (
                    <span className="bg-brand-blue text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User area */}
      <div className="border-t border-white/5 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full gradient-bg flex-shrink-0 flex items-center justify-center text-sm font-bold text-white">
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left text-xs text-slate-500 hover:text-red-400 transition px-1 py-1"
        >
          Sign out →
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-[#070b0f] overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-col md:h-full">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 flex flex-col h-full">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-white/5 bg-[#0f1117] flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-400 hover:text-white transition"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-display font-bold text-lg gradient-text">FlowOS</span>
          <NotificationBell />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
