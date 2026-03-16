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
      { label: 'Dashboard', href: '/dashboard', icon: '⊞', color: '#7c6fe0' },
      { label: 'Inbox', href: '/dashboard/inbox', icon: '✉', color: '#4a9eff' },
      { label: 'Chat', href: '/dashboard/chat', icon: '💬', color: '#00c9b1' },
      { label: 'Time Tracking', href: '/dashboard/time-tracking', icon: '⏱', color: '#ffc107' },
    ],
  },
  {
    label: 'Work',
    items: [
      { label: 'Projects', href: '/dashboard/projects', icon: '◈', color: '#4a9eff' },
      { label: 'Tasks', href: '/dashboard/tasks', icon: '✓', color: '#4caf82' },
      { label: 'Clients', href: '/dashboard/clients', icon: '◉', color: '#ff6b9d' },
      { label: 'Team', href: '/dashboard/team', icon: '◎', color: '#7c6fe0' },
      { label: 'Goals & OKRs', href: '/dashboard/goals', icon: '◎', color: '#ff7043' },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { label: 'Content Planner', href: '/dashboard/content', icon: '◫', color: '#00c9b1' },
      { label: 'Idea Bank', href: '/dashboard/ideas', icon: '◆', color: '#ffc107' },
      { label: 'Ad Campaigns', href: '/dashboard/campaigns', icon: '◈', color: '#ff7043' },
    ],
  },
  {
    label: 'Creative',
    items: [
      { label: 'Design Hub', href: '/dashboard/creative/design', icon: '◈', color: '#ff6b9d' },
      { label: 'Content Team', href: '/dashboard/creative/content', icon: '◉', color: '#4a9eff' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'Competitor Analysis', href: '/dashboard/intelligence', icon: '◎', color: '#4caf82' },
      { label: 'Market Research', href: '/dashboard/intelligence/research', icon: '◆', color: '#7c6fe0' },
      { label: 'Campaign Generator', href: '/dashboard/intelligence/campaigns', icon: '◈', color: '#ff7043' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { label: 'Invoices', href: '/dashboard/finance/invoices', icon: '◫', color: '#4caf82' },
      { label: 'Expenses', href: '/dashboard/finance/expenses', icon: '◉', color: '#ef5350' },
      { label: 'Reports', href: '/dashboard/reports', icon: '◈', color: '#4a9eff' },
    ],
  },
  {
    label: 'Agency',
    items: [
      { label: 'Docs & Wiki', href: '/dashboard/docs', icon: '◫', color: '#ffc107' },
      { label: 'Forms', href: '/dashboard/forms', icon: '◉', color: '#00c9b1' },
      { label: 'Meetings', href: '/dashboard/meetings', icon: '◎', color: '#ff6b9d' },
      { label: 'Shoot Sessions', href: '/dashboard/shoots', icon: '◆', color: '#7c6fe0' },
      { label: 'Files', href: '/dashboard/files', icon: '◈', color: '#4a9eff' },
      { label: 'Settings', href: '/dashboard/settings', icon: '⚙', color: '#7b7fa8' },
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

  const typeColors: Record<string, string> = { task: '#4caf82', project: '#4a9eff', client: '#ff6b9d', doc: '#ffc107' };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-xl mx-4 rounded-2xl overflow-hidden shadow-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border-hover)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tasks, projects, clients, docs…"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--text)' }}
          />
          {loading && <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--purple)', borderTopColor: 'transparent' }} />}
          <kbd className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>ESC</kbd>
        </div>
        {results.length > 0 && (
          <div className="py-1 max-h-80 overflow-y-auto">
            {results.map((r, i) => (
              <Link key={r.id} href={r.href} onClick={onClose}
                className="flex items-center gap-3 px-4 py-2.5 transition"
                style={{ background: i === selected ? 'var(--purple-dim)' : undefined }}>
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: typeColors[r.type] }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: 'var(--text)' }}>{r.title}</p>
                  {r.subtitle && <p className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{r.subtitle}</p>}
                </div>
                <span className="text-xs capitalize" style={{ color: 'var(--text-dim)' }}>{r.type}</span>
              </Link>
            ))}
          </div>
        )}
        {q && !loading && results.length === 0 && (
          <div className="py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No results for "{q}"</div>
        )}
        {!q && (
          <div className="px-4 py-3">
            <p className="text-xs mb-2" style={{ color: 'var(--text-dim)' }}>KEYBOARD SHORTCUTS</p>
            <div className="grid grid-cols-2 gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span><kbd className="px-1 rounded" style={{ background: 'var(--surface)' }}>C</kbd> New task</span>
              <span><kbd className="px-1 rounded" style={{ background: 'var(--surface)' }}>G D</kbd> Dashboard</span>
              <span><kbd className="px-1 rounded" style={{ background: 'var(--surface)' }}>G T</kbd> Tasks</span>
              <span><kbd className="px-1 rounded" style={{ background: 'var(--surface)' }}>G P</kbd> Projects</span>
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--purple)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const Sidebar = () => (
    <aside className="w-60 flex-shrink-0 flex flex-col h-full overflow-hidden" style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}>
      {/* Workspace header */}
      <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          F
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate" style={{ color: 'var(--text)' }}>FlowOS</p>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Agency Edition</p>
        </div>
        <button onClick={toggleTheme} className="p-1.5 rounded-lg transition text-base flex-shrink-0" style={{ color: 'var(--text-muted)' }} title="Toggle theme">
          {theme === 'dark' ? '☀' : '🌙'}
        </button>
      </div>

      {/* Search bar */}
      <div className="px-3 py-2">
        <button onClick={() => setSearchOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition"
          style={{ background: 'var(--card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="flex-1 text-left text-xs">Search…</span>
          <kbd className="text-[10px] px-1 rounded" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>⌘K</kbd>
        </button>
      </div>

      {/* Create button */}
      <div className="px-3 pb-2">
        <Link href="/dashboard/tasks?new=1"
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold text-white transition hover:opacity-90 gradient-bg">
          <span className="text-base leading-none">+</span>
          <span>Create</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-1 px-2">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-1">
            <p className="text-[10px] font-bold tracking-widest uppercase px-2 py-1.5" style={{ color: 'var(--text-dim)' }}>
              {section.label}
            </p>
            {section.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2.5 py-1.5 rounded-lg text-sm font-medium transition-all mb-0.5 ${active ? 'nav-item-active' : 'nav-item-inactive'}`}
                  style={{ paddingRight: '12px' }}>
                  <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center rounded text-xs" style={{ background: active ? `${item.color}22` : 'transparent', color: active ? item.color : 'var(--text-muted)' }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-3" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full gradient-bg flex-shrink-0 flex items-center justify-center text-sm font-bold text-white">
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: 'var(--text)' }}>{user?.name}</p>
            <p className="text-[10px] truncate capitalize" style={{ color: 'var(--text-muted)' }}>{user?.role}</p>
          </div>
          <NotificationBell />
          <button onClick={handleLogout} className="text-[10px] transition px-1.5 py-1 rounded" style={{ color: 'var(--text-muted)' }}
            title="Sign out">
            ⎋
          </button>
        </div>
      </div>
    </aside>
  );

  const bottomNavItems = [
    { icon: '⊞', label: 'Home', href: '/dashboard' },
    { icon: '✓', label: 'Tasks', href: '/dashboard/tasks' },
    { icon: '◈', label: 'Projects', href: '/dashboard/projects' },
    { icon: '💬', label: 'Chat', href: '/dashboard/chat' },
    { icon: '☰', label: 'More', href: '', action: () => setSidebarOpen(true) },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
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
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center justify-between px-4 h-14 border-b flex-shrink-0" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <button onClick={() => setSidebarOpen(true)} className="p-2 transition" style={{ color: 'var(--text-muted)' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-bold text-lg gradient-text">FlowOS</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(true)} className="p-2 transition" style={{ color: 'var(--text-muted)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <NotificationBell />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto main-with-bottom-nav">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="mobile-bottom-nav">
        {bottomNavItems.map((item) => (
          item.action ? (
            <button key={item.label} onClick={item.action} className={isActive(item.href) ? 'active' : ''}>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ) : (
            <Link key={item.label} href={item.href} legacyBehavior>
              <button className={isActive(item.href) ? 'active' : ''}>
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </Link>
          )
        ))}
      </nav>
    </div>
  );
}
