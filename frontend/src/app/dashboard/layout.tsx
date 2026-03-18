'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Inbox, MessageSquare, Clock,
  FolderKanban, CheckSquare, Users, UserCircle, Target,
  CalendarDays, Lightbulb, Megaphone,
  Palette, FileText,
  TrendingUp, Search, Sparkles,
  Receipt, CreditCard, BarChart3,
  BookOpen, ClipboardList, Video, Camera, HardDrive, Settings,
  Plus, Sun, Moon, LogOut, Menu, Bell, Zap, Globe, LayoutTemplate,
} from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import NotificationBell from '@/components/notifications/NotificationBell';
import { Avatar } from '@/components/ui/Avatar';
import StorageBar from '@/components/ui/StorageBar';
import apiClient from '@/lib/apiClient';
import { disconnectSocket } from '@/lib/socket';

const NAV_SECTIONS = [
  {
    label: 'Workspace',
    items: [
      { label: 'Dashboard',    href: '/dashboard',              Icon: LayoutDashboard, color: 'var(--indigo)' },
      { label: 'Inbox',        href: '/dashboard/inbox',        Icon: Inbox,           color: 'var(--cyan)' },
      { label: 'Chat',         href: '/dashboard/chat',         Icon: MessageSquare,   color: 'var(--emerald)' },
      { label: 'Time Tracking',href: '/dashboard/time-tracking',Icon: Clock,           color: 'var(--amber)' },
    ],
  },
  {
    label: 'Work',
    items: [
      { label: 'Projects',   href: '/dashboard/projects', Icon: FolderKanban, color: 'var(--cyan)' },
      { label: 'Tasks',      href: '/dashboard/tasks',    Icon: CheckSquare,  color: 'var(--emerald)' },
      { label: 'Clients',    href: '/dashboard/clients',  Icon: UserCircle,   color: 'var(--rose)' },
      { label: 'Team',       href: '/dashboard/team',     Icon: Users,        color: 'var(--indigo)' },
      { label: 'Goals & OKRs', href: '/dashboard/goals', Icon: Target,       color: 'var(--amber)' },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { label: 'Content Planner', href: '/dashboard/content',   Icon: CalendarDays, color: 'var(--cyan)' },
      { label: 'Idea Bank',       href: '/dashboard/ideas',     Icon: Lightbulb,    color: 'var(--amber)' },
      { label: 'Ad Campaigns',    href: '/dashboard/campaigns', Icon: Megaphone,    color: 'var(--orange, #f97316)' },
    ],
  },
  {
    label: 'Creative',
    items: [
      { label: 'Design Hub',    href: '/dashboard/creative/design',  Icon: Palette,   color: 'var(--rose)' },
      { label: 'Content Team',  href: '/dashboard/creative/content', Icon: FileText,  color: 'var(--cyan)' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'AI Campaign Builder', href: '/dashboard/intelligence/campaign-builder', Icon: Sparkles,   color: 'var(--violet)' },
      { label: 'AI Generator',        href: '/dashboard/intelligence/generate',         Icon: Sparkles,   color: 'var(--indigo)' },
      { label: 'Competitor Analysis', href: '/dashboard/intelligence',                  Icon: TrendingUp, color: 'var(--emerald)' },
      { label: 'Market Research',     href: '/dashboard/intelligence/research',         Icon: Search,     color: 'var(--cyan)' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { label: 'Invoices',  href: '/dashboard/finance/invoices',  Icon: Receipt,    color: 'var(--emerald)' },
      { label: 'Expenses',  href: '/dashboard/finance/expenses',  Icon: CreditCard, color: 'var(--rose)' },
      { label: 'Reports',   href: '/dashboard/reports',           Icon: BarChart3,  color: 'var(--cyan)' },
    ],
  },
  {
    label: 'Agency',
    items: [
      { label: 'Automations',     href: '/dashboard/automations',     Icon: Zap,           color: 'var(--amber)' },
      { label: 'Templates',       href: '/dashboard/templates',       Icon: LayoutTemplate,color: 'var(--cyan)' },
      { label: 'Client Portal',   href: '/dashboard/clients/portal',  Icon: Globe,         color: 'var(--emerald)' },
      { label: 'Docs & Wiki',     href: '/dashboard/docs',            Icon: BookOpen,      color: 'var(--indigo)' },
      { label: 'Forms',           href: '/dashboard/forms',           Icon: ClipboardList, color: 'var(--violet)' },
      { label: 'Meetings',        href: '/dashboard/meetings',        Icon: Video,         color: 'var(--rose)' },
      { label: 'Shoot Sessions',  href: '/dashboard/shoots',          Icon: Camera,        color: 'var(--indigo)' },
      { label: 'Files',           href: '/dashboard/files',           Icon: HardDrive,     color: 'var(--cyan)' },
      { label: 'Settings',        href: '/dashboard/settings',        Icon: Settings,      color: 'var(--text-2)' },
    ],
  },
];

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/tasks': 'Tasks',
  '/dashboard/projects': 'Projects',
  '/dashboard/clients': 'Clients',
  '/dashboard/team': 'Team',
  '/dashboard/inbox': 'Inbox',
  '/dashboard/chat': 'Chat',
  '/dashboard/time-tracking': 'Time Tracking',
  '/dashboard/goals': 'Goals & OKRs',
  '/dashboard/content': 'Content Planner',
  '/dashboard/ideas': 'Idea Bank',
  '/dashboard/campaigns': 'Ad Campaigns',
  '/dashboard/creative/design': 'Design Hub',
  '/dashboard/creative/content': 'Content Team',
  '/dashboard/intelligence': 'Competitor Analysis',
  '/dashboard/intelligence/generate': 'AI Generator',
  '/dashboard/intelligence/campaign-builder': 'AI Campaign Builder',
  '/dashboard/intelligence/research': 'Market Research',
  '/dashboard/finance/invoices': 'Invoices',
  '/dashboard/finance/expenses': 'Expenses',
  '/dashboard/reports': 'Reports',
  '/dashboard/automations': 'Automations',
  '/dashboard/templates': 'Templates',
  '/dashboard/clients/portal': 'Client Portal',
  '/dashboard/docs': 'Docs & Wiki',
  '/dashboard/forms': 'Forms',
  '/dashboard/meetings': 'Meetings',
  '/dashboard/shoots': 'Shoot Sessions',
  '/dashboard/files': 'Files',
  '/dashboard/settings': 'Settings',
};

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
        if (tasks.status === 'fulfilled')
          (tasks.value.data || []).slice(0, 3).forEach((t: any) =>
            r.push({ id: t.id, type: 'task', title: t.title, subtitle: t.status, href: '/dashboard/tasks' }));
        if (projects.status === 'fulfilled')
          (projects.value.data || []).slice(0, 3).forEach((p: any) =>
            r.push({ id: p.id, type: 'project', title: p.name, subtitle: p.status, href: '/dashboard/projects' }));
        if (clients.status === 'fulfilled')
          (clients.value.data || []).slice(0, 3).forEach((c: any) =>
            r.push({ id: c.id, type: 'client', title: c.name, subtitle: c.email, href: '/dashboard/clients' }));
        if (docs.status === 'fulfilled')
          (docs.value.data || []).slice(0, 3).forEach((d: any) =>
            r.push({ id: d.id, type: 'doc', title: d.title, subtitle: 'Doc', href: `/dashboard/docs/${d.id}` }));
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

  const typeColor: Record<string, string> = { task: 'var(--emerald)', project: 'var(--cyan)', client: 'var(--rose)', doc: 'var(--amber)' };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl mx-4 rounded-2xl overflow-hidden shadow-2xl animate-scale-in"
        style={{ background: 'var(--card)', border: '1px solid var(--border-hover)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <Search size={15} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tasks, projects, clients, docs…"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--text)' }}
          />
          {loading && <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--indigo)', borderTopColor: 'transparent' }} />}
          <kbd className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--surface)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>ESC</kbd>
        </div>
        {results.length > 0 && (
          <div className="py-1 max-h-80 overflow-y-auto">
            {results.map((r, i) => (
              <Link key={r.id} href={r.href} onClick={onClose}
                className="flex items-center gap-3 px-4 py-2.5 transition"
                style={{ background: i === selected ? 'var(--indigo-2)' : undefined }}>
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: typeColor[r.type] }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: 'var(--text)' }}>{r.title}</p>
                  {r.subtitle && <p className="text-xs capitalize" style={{ color: 'var(--text-2)' }}>{r.subtitle}</p>}
                </div>
                <span className="text-xs capitalize" style={{ color: 'var(--text-3)' }}>{r.type}</span>
              </Link>
            ))}
          </div>
        )}
        {q && !loading && results.length === 0 && (
          <div className="py-8 text-center text-sm" style={{ color: 'var(--text-2)' }}>No results for &ldquo;{q}&rdquo;</div>
        )}
        {!q && (
          <div className="px-4 py-3">
            <p className="text-xs mb-2" style={{ color: 'var(--text-3)' }}>KEYBOARD SHORTCUTS</p>
            <div className="grid grid-cols-2 gap-1 text-xs" style={{ color: 'var(--text-2)' }}>
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
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  // Restore collapsed state from localStorage after hydration
  useEffect(() => {
    if (!hydrated) return;
    const stored = localStorage.getItem('sidebar-collapsed');
    if (stored === '1') setCollapsed(true);
  }, [hydrated]);

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

  function handleLogout() { disconnectSocket(); logout(); router.replace('/'); }

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  }

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('sidebar-collapsed', next ? '1' : '0');
  }

  const pageTitle = PAGE_TITLES[pathname] || 'Dashboard';

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--indigo)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const sidebarWidth = collapsed ? 56 : 224;

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <aside
      className="flex-shrink-0 flex flex-col h-full overflow-hidden"
      style={{
        width: isMobile ? 224 : sidebarWidth,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        transition: 'width 0.2s ease',
      }}
    >
      {/* Workspace header */}
      {(!collapsed || isMobile) ? (
        <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: 'var(--grad-primary)' }}>
            F
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold tracking-tight truncate" style={{ color: 'var(--text)' }}>TasksDone</p>
            <p className="text-[10px]" style={{ color: 'var(--text-3)' }}>Agency Edition</p>
          </div>
          <button
            onClick={toggleTheme}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition flex-shrink-0"
            style={{ color: 'var(--text-2)', background: 'var(--border)' }}
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: 'var(--grad-primary)' }}>
            F
          </div>
        </div>
      )}

      {/* Search bar */}
      {(!collapsed || isMobile) ? (
        <div className="px-3 pt-3 pb-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-2 px-3 h-8 rounded-lg text-sm transition"
            style={{ background: 'var(--card)', color: 'var(--text-2)', border: '1px solid var(--border)' }}
          >
            <Search size={12} style={{ flexShrink: 0 }} />
            <span className="flex-1 text-left text-xs">Search…</span>
            <kbd className="text-[10px] px-1 rounded" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-3)' }}>⌘K</kbd>
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center pt-3 pb-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition"
            style={{ background: 'var(--card)', color: 'var(--text-2)', border: '1px solid var(--border)' }}
            title="Search (⌘K)"
          >
            <Search size={14} />
          </button>
        </div>
      )}

      {/* Create button */}
      {(!collapsed || isMobile) ? (
        <div className="px-3 pb-3">
          <Link
            href="/dashboard/tasks?new=1"
            className="w-full flex items-center justify-center gap-2 h-8 rounded-lg text-xs font-semibold text-white transition hover:opacity-90"
            style={{ background: 'var(--grad-primary)' }}
          >
            <Plus size={13} />
            <span>Create</span>
          </Link>
        </div>
      ) : (
        <div className="flex items-center justify-center pb-3">
          <Link
            href="/dashboard/tasks?new=1"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white transition hover:opacity-90"
            style={{ background: 'var(--grad-primary)' }}
            title="Create"
          >
            <Plus size={14} />
          </Link>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-1" style={{ paddingLeft: collapsed && !isMobile ? 0 : undefined }}>
        {NAV_SECTIONS.map((section, sectionIdx) => (
          <div key={section.label} className="mb-0.5">
            {/* Section divider line */}
            {sectionIdx > 0 && (
              <div style={{ height: '1px', background: 'var(--border)', margin: '4px 8px 4px 8px', opacity: 0.6 }} />
            )}
            {/* Section label — hidden when collapsed */}
            {(!collapsed || isMobile) && (
              <p className="text-[10px] font-bold tracking-widest uppercase px-3 py-1" style={{ color: 'var(--text-3)' }}>
                {section.label}
              </p>
            )}
            {collapsed && !isMobile && <div style={{ height: 4 }} />}
            {section.items.map((item) => {
              const active = isActive(item.href);
              if (collapsed && !isMobile) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    title={item.label}
                    className="flex items-center justify-center mb-0.5 transition-all"
                    style={{
                      height: 32,
                      background: active ? `color-mix(in srgb, ${item.color} 12%, transparent)` : 'transparent',
                      borderLeft: active ? `2px solid ${item.color}` : '2px solid transparent',
                      color: active ? item.color : 'var(--text-3)',
                      borderRadius: '0 8px 8px 0',
                      marginLeft: 0,
                      marginRight: 4,
                      transition: 'width 0.2s ease, opacity 0.15s',
                    }}
                  >
                    <item.Icon size={15} />
                  </Link>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  title={item.label}
                  className="flex items-center gap-2.5 py-1.5 text-sm font-medium transition-all mb-0.5"
                  style={{
                    paddingLeft: 10,
                    paddingRight: 8,
                    background: active ? `color-mix(in srgb, ${item.color} 12%, transparent)` : 'transparent',
                    borderLeft: active ? `2px solid ${item.color}` : '2px solid transparent',
                    color: active ? item.color : undefined,
                    borderRadius: '0 8px 8px 0',
                    marginLeft: 0,
                    marginRight: 4,
                    transition: 'width 0.2s ease, opacity 0.15s',
                  }}
                >
                  <span
                    className="w-5 h-5 flex-shrink-0 flex items-center justify-center rounded"
                    style={{
                      background: active ? `color-mix(in srgb, ${item.color} 15%, transparent)` : 'transparent',
                      color: active ? item.color : 'var(--text-3)',
                    }}
                  >
                    <item.Icon size={15} />
                  </span>
                  <span style={{ color: active ? item.color : undefined }}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Storage bar — hidden when collapsed */}
      {(!collapsed || isMobile) && <StorageBar />}

      {/* Collapse toggle button — desktop only */}
      {!isMobile && (
        <button
          onClick={toggleCollapsed}
          className="w-full flex items-center justify-center h-8 transition"
          style={{ color: 'var(--text-3)', borderTop: '1px solid var(--border)' }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      )}

      {/* User footer */}
      {(!collapsed || isMobile) ? (
        <div className="px-3 py-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2.5">
            <Avatar name={user?.name || '?'} size={28} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--text)' }}>{user?.name}</p>
              <p className="text-[10px] truncate capitalize" style={{ color: 'var(--text-2)' }}>{user?.role}</p>
            </div>
            <NotificationBell />
            <button
              onClick={handleLogout}
              className="w-7 h-7 flex items-center justify-center rounded-lg transition hover:opacity-70 flex-shrink-0"
              style={{ color: 'var(--text-2)', background: 'var(--border)' }}
              title="Sign out"
            >
              <LogOut size={12} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-3" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="flex items-center justify-center"
          >
            <Avatar name={user?.name || '?'} size={28} />
          </button>
        </div>
      )}
    </aside>
  );

  const bottomNavItems = [
    { Icon: LayoutDashboard, label: 'Home',     href: '/dashboard' },
    { Icon: CheckSquare,     label: 'Tasks',    href: '/dashboard/tasks' },
    { Icon: FolderKanban,    label: 'Projects', href: '/dashboard/projects' },
    { Icon: MessageSquare,   label: 'Chat',     href: '/dashboard/chat' },
    { Icon: Menu,            label: 'More',     href: '', action: () => setSidebarOpen(true) },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}

      {/* Desktop sidebar */}
      <div
        className="hidden md:flex md:flex-col md:h-full flex-shrink-0"
        style={{
          width: sidebarWidth,
          transition: 'width 0.2s ease',
        }}
      >
        <SidebarContent />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 flex flex-col h-full">
            <SidebarContent isMobile />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ transition: 'width 0.2s ease' }}>
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center justify-between px-4 h-14 flex-shrink-0" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => setSidebarOpen(true)} className="p-2 transition" style={{ color: 'var(--text-2)' }}>
            <Menu size={20} />
          </button>
          <span className="font-bold text-base gradient-text tracking-tight">TasksDone</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setSearchOpen(true)} className="p-2 transition" style={{ color: 'var(--text-2)' }}>
              <Search size={16} />
            </button>
            <NotificationBell />
          </div>
        </header>

        {/* Desktop topbar */}
        <header className="hidden md:flex items-center justify-between px-6 h-12 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
          <h1 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{pageTitle}</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 h-7 rounded-lg text-xs transition"
              style={{ background: 'var(--card)', color: 'var(--text-2)', border: '1px solid var(--border)' }}
            >
              <Search size={12} /><span>Search</span><kbd className="text-[10px] px-1 rounded" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-3)' }}>⌘K</kbd>
            </button>
            <NotificationBell />
            <Avatar name={user?.name || '?'} size={26} />
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
              <item.Icon size={20} className="nav-icon" style={{ display: 'block' }} />
              <span>{item.label}</span>
            </button>
          ) : (
            <Link key={item.label} href={item.href} legacyBehavior>
              <button className={isActive(item.href) ? 'active' : ''}>
                <item.Icon size={20} className="nav-icon" style={{ display: 'block' }} />
                <span>{item.label}</span>
              </button>
            </Link>
          )
        ))}
      </nav>
    </div>
  );
}
