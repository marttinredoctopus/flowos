'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import NotificationBell from '@/components/notifications/NotificationBell';
import apiClient from '@/lib/apiClient';

const NAV_SECTIONS = [
  {
    label: 'Workspace',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
      { label: 'Inbox', href: '/dashboard/inbox', icon: '📥' },
      { label: 'Chat', href: '/dashboard/chat', icon: '💬' },
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
      { label: 'Goals & OKRs', href: '/dashboard/goals', icon: '🎯' },
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
    label: 'Creative',
    items: [
      { label: 'Design Hub', href: '/dashboard/creative/design', icon: '🎨' },
      { label: 'Content Team', href: '/dashboard/creative/content', icon: '✍️' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'Competitor Analysis', href: '/dashboard/intelligence', icon: '🔍' },
      { label: 'Market Research', href: '/dashboard/intelligence/research', icon: '🧠' },
      { label: 'Campaign Generator', href: '/dashboard/intelligence/campaigns', icon: '🚀' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { label: 'Invoices', href: '/dashboard/finance/invoices', icon: '📄' },
      { label: 'Expenses', href: '/dashboard/finance/expenses', icon: '💳' },
      { label: 'Reports', href: '/dashboard/reports', icon: '📊' },
    ],
  },
  {
    label: 'Agency',
    items: [
      { label: 'Docs & Wiki', href: '/dashboard/docs', icon: '📝' },
      { label: 'Forms', href: '/dashboard/forms', icon: '📋' },
      { label: 'Meetings', href: '/dashboard/meetings', icon: '🎥' },
      { label: 'Shoot Sessions', href: '/dashboard/shoots', icon: '📸' },
      { label: 'Files', href: '/dashboard/files', icon: '🗂️' },
      { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
    ],
  },
];

interface SearchResult {
  id: string;
  type: 'task' | 'project' | 'client' | 'doc';
  title: string;
  subtitle?: string;
  href: string;
}

function GlobalSearch({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!q.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [tasks, projects, clients, docs] = await Promise.allSettled([
          apiClient.get('/tasks', { params: { q } }),
          apiClient.get('/projects', { params: { q } }),
          apiClient.get('/clients', { params: { q } }),
          apiClient.get('/docs/search', { params: { q } }),
        ]);
        const r: SearchResult[] = [];
        if (tasks.status === 'fulfilled') {
          (tasks.value.data || []).slice(0, 3).forEach((t: any) =>
            r.push({ id: t.id, type: 'task', title: t.title, subtitle: t.status, href: '/dashboard/tasks' }));
        }
        if (projects.status === 'fulfilled') {
          (projects.value.data || []).slice(0, 3).forEach((p: any) =>
            r.push({ id: p.id, type: 'project', title: p.name, subtitle: p.status, href: '/dashboard/projects' }));
        }
        if (clients.status === 'fulfilled') {
          (clients.value.data || []).slice(0, 3).forEach((c: any) =>
            r.push({ id: c.id, type: 'client', title: c.name, subtitle: c.email, href: '/dashboard/clients' }));
        }
        if (docs.status === 'fulfilled') {
          (docs.value.data || []).slice(0, 3).forEach((d: any) =>
            r.push({ id: d.id, type: 'doc', title: d.title, subtitle: 'Doc', href: `/dashboard/docs/${d.id}` }));
        }
        setResults(r);
        setSelected(0);
      } finally { setLoading(false); }
    }, 200);
    return () => clearTimeout(timer);
  }, [q]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && results[selected]) { router.push(results[selected].href); onClose(); }
    if (e.key === 'Escape') onClose();
  }

  const typeIcons: Record<string, string> = { task: '✅', project: '📁', client: '👥', doc: '📝' };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-xl mx-4 bg-[#0f1117] border border-white/10 rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
          <span className="text-slate-400">🔍</span>
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tasks, projects, clients, docs…"
            className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-sm"
          />
          {loading && <div className="w-4 h-4 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />}
          <kbd className="text-xs text-slate-500 border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
        </div>
        {results.length > 0 && (
          <div className="py-1 max-h-80 overflow-y-auto">
            {results.map((r, i) => (
              <Link key={r.id} href={r.href} onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2.5 transition ${i === selected ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                <span className="text-lg">{typeIcons[r.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{r.title}</p>
                  {r.subtitle && <p className="text-xs text-slate-500 capitalize">{r.subtitle}</p>}
                </div>
                <span className="text-xs text-slate-600 capitalize">{r.type}</span>
              </Link>
            ))}
          </div>
        )}
        {q && !loading && results.length === 0 && (
          <div className="py-8 text-center text-slate-500 text-sm">No results for "{q}"</div>
        )}
        {!q && (
          <div className="px-4 py-3">
            <p className="text-xs text-slate-600 mb-2">KEYBOARD SHORTCUTS</p>
            <div className="grid grid-cols-2 gap-1 text-xs text-slate-500">
              <span><kbd className="bg-white/5 px-1 rounded">C</kbd> New task</span>
              <span><kbd className="bg-white/5 px-1 rounded">G D</kbd> Dashboard</span>
              <span><kbd className="bg-white/5 px-1 rounded">G T</kbd> Tasks</span>
              <span><kbd className="bg-white/5 px-1 rounded">G P</kbd> Projects</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggle: toggleTheme } = useThemeStore();
  const [hydrated, setHydrated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [gPressed, setGPressed] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) router.replace('/');
  }, [hydrated, isAuthenticated, router]);

  // Global keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return;

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); return; }
      if (e.key === 'Escape') { setSearchOpen(false); return; }

      if (gPressed) {
        setGPressed(false);
        if (e.key === 'd') router.push('/dashboard');
        if (e.key === 't') router.push('/dashboard/tasks');
        if (e.key === 'p') router.push('/dashboard/projects');
        if (e.key === 'c') router.push('/dashboard/clients');
        return;
      }

      if (e.key === 'g') { setGPressed(true); setTimeout(() => setGPressed(false), 1000); return; }
      if (e.key === 'c' && !e.metaKey) router.push('/dashboard/tasks?new=1');
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gPressed, router]);

  function handleLogout() { logout(); router.replace('/'); }

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
      <div className="p-5 border-b border-white/5">
        <div className="font-display font-bold text-xl gradient-text leading-tight">FlowOS</div>
        <div className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase mt-0.5">Agency Edition</div>
      </div>

      {/* CMD+K search trigger */}
      <button onClick={() => setSearchOpen(true)}
        className="mx-3 mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/8 border border-white/5 text-slate-500 text-sm transition group">
        <span>🔍</span>
        <span className="flex-1 text-left text-xs">Search…</span>
        <kbd className="text-[10px] bg-white/5 border border-white/10 rounded px-1">⌘K</kbd>
      </button>

      <nav className="flex-1 overflow-y-auto py-2">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase px-4 mb-1 mt-5 first:mt-2">
              {section.label}
            </p>
            {section.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition mx-2 mb-0.5 ${
                    active ? 'bg-white/10 text-white border-l-2 border-brand-blue pl-[14px]'
                           : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}>
                  <span className="text-base leading-none">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-white/5 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full gradient-bg flex-shrink-0 flex items-center justify-center text-sm font-bold text-white">
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.role}</p>
          </div>
          <NotificationBell />
        </div>
        <div className="flex items-center justify-between">
          <button onClick={handleLogout} className="text-xs text-slate-500 hover:text-red-400 transition px-1 py-1">
            Sign out →
          </button>
          <button onClick={toggleTheme} title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition text-base">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-[#070b0f] overflow-hidden">
      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}

      <div className="hidden md:flex md:flex-col md:h-full">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 flex flex-col h-full"><Sidebar /></div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-white/5 bg-[#0f1117] flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-display font-bold text-lg gradient-text">FlowOS</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(true)} className="p-2 text-slate-400 hover:text-white transition">🔍</button>
            <NotificationBell />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
