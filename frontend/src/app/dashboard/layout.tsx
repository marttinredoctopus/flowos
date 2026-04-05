'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  House, Tray, ChatCircle, Timer,
  Kanban, CheckSquare, Users, User, Target, GridFour,
  CalendarDots, Lightbulb, Megaphone,
  PaintBrush,
  TrendUp, MagnifyingGlass, Sparkle,
  Receipt, CreditCard, ChartBar,
  BookOpen, ClipboardText, VideoCamera, Camera, HardDrive, Gear,
  Plus, Sun, Moon, SignOut, List, Bell, Lightning, Globe, SquaresFour,
  CaretLeft, CaretRight,
} from '@phosphor-icons/react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import NotificationBell from '@/components/notifications/NotificationBell';
import { Avatar } from '@/components/ui/Avatar';
import StorageBar from '@/components/ui/StorageBar';
import apiClient from '@/lib/apiClient';
import { disconnectSocket } from '@/lib/socket';

const ALL_NAV_SECTIONS = [
  {
    label: 'Spaces',
    items: [
      { label: 'Spaces', href: '/dashboard/spaces', Icon: GridFour, color: '#7030EF' },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { label: 'Dashboard',    href: '/dashboard',              Icon: House,         color: '#A580FF' },
      { label: 'Inbox',        href: '/dashboard/inbox',        Icon: Tray,          color: '#00D4FF', roles: ['admin','manager','member','team'] },
      { label: 'Chat',         href: '/dashboard/chat',         Icon: ChatCircle,    color: '#00E5A0', roles: ['admin','manager','member','team'] },
      { label: 'Time Tracking',href: '/dashboard/time-tracking',Icon: Timer,         color: '#FFB547', roles: ['admin','manager','member','team'] },
    ],
  },
  {
    label: 'Work',
    items: [
      { label: 'Projects',   href: '/dashboard/projects', Icon: Kanban,       color: '#00D4FF' },
      { label: 'Tasks',      href: '/dashboard/tasks',    Icon: CheckSquare,  color: '#00E5A0' },
      { label: 'Clients',    href: '/dashboard/clients',  Icon: User,         color: '#FF4D6A', roles: ['admin','manager','member','team'] },
      { label: 'Team',       href: '/dashboard/team',     Icon: Users,        color: '#A580FF', roles: ['admin','manager','member','team'] },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { label: 'Content Hub', href: '/dashboard/content',          Icon: CalendarDots, color: '#00D4FF',  roles: ['admin','manager','member','team'] },
      { label: 'Strategy Hub',    href: '/dashboard/content/sections', Icon: Lightbulb,    color: '#DB1FFF', roles: ['admin','manager','member','team'] },
      { label: 'Idea Bank',       href: '/dashboard/ideas',            Icon: Lightbulb,    color: '#FFB547',  roles: ['admin','manager','member','team'] },
      { label: 'Ad Campaigns',    href: '/dashboard/campaigns',        Icon: Megaphone,    color: '#FF7A30',  roles: ['admin','manager','member','team'] },
    ],
  },
  {
    label: 'Creative',
    items: [
      { label: 'Design Hub', href: '/dashboard/creative/design', Icon: PaintBrush, color: '#FF4D6A', roles: ['admin','manager','member','team'] },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'AI Campaign Builder', href: '/dashboard/intelligence/campaign-builder', Icon: Sparkle,         color: '#DB1FFF', roles: ['admin','manager','member','team'] },
      { label: 'AI Generator',        href: '/dashboard/intelligence/generate',         Icon: Sparkle,         color: '#A580FF', roles: ['admin','manager','member','team'] },
      { label: 'Competitor Analysis', href: '/dashboard/intelligence',                  Icon: TrendUp,         color: '#00E5A0', roles: ['admin','manager','member','team'] },
      { label: 'Market Research',     href: '/dashboard/intelligence/research',         Icon: MagnifyingGlass, color: '#00D4FF', roles: ['admin','manager','member','team'] },
    ],
  },
  {
    label: 'Finance',
    roles: ['admin', 'manager'],
    items: [
      { label: 'Invoices', href: '/dashboard/finance/invoices', Icon: Receipt,   color: '#00E5A0', roles: ['admin','manager'] },
      { label: 'Expenses', href: '/dashboard/finance/expenses', Icon: CreditCard,color: '#FF4D6A', roles: ['admin','manager'] },
      { label: 'Reports',  href: '/dashboard/reports',          Icon: ChartBar,  color: '#00D4FF', roles: ['admin','manager'] },
    ],
  },
  {
    label: 'Agency',
    items: [
      { label: 'Automations',   href: '/dashboard/automations',    Icon: Lightning,     color: '#FFB547', roles: ['admin','manager'] },
      { label: 'Templates',     href: '/dashboard/templates',      Icon: SquaresFour,   color: '#00D4FF', roles: ['admin','manager','member','team'] },
      { label: 'Client Portal', href: '/dashboard/clients/portal', Icon: Globe,         color: '#00E5A0' },
      { label: 'Docs & Wiki',   href: '/dashboard/docs',           Icon: BookOpen,      color: '#A580FF' },
      { label: 'Forms',         href: '/dashboard/forms',          Icon: ClipboardText, color: '#DB1FFF', roles: ['admin','manager','member','team'] },
      { label: 'Meetings',      href: '/dashboard/meetings',       Icon: VideoCamera,   color: '#FF4D6A', roles: ['admin','manager','member','team'] },
      { label: 'Shoot Sessions',href: '/dashboard/shoots',         Icon: Camera,        color: '#A580FF', roles: ['admin','manager','member','team'] },
      { label: 'Files',         href: '/dashboard/files',          Icon: HardDrive,     color: '#00D4FF' },
      { label: 'Settings',      href: '/dashboard/settings',       Icon: Gear,          color: '#8585A4', roles: ['admin','manager'] },
    ],
  },
];

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/tasks': 'Tasks',
  '/dashboard/spaces': 'Spaces',
  '/dashboard/projects': 'Projects',
  '/dashboard/clients': 'Clients',
  '/dashboard/team': 'Team',
  '/dashboard/inbox': 'Inbox',
  '/dashboard/chat': 'Chat',
  '/dashboard/time-tracking': 'Time Tracking',
  '/dashboard/content': 'Content Planner',
  '/dashboard/ideas': 'Idea Bank',
  '/dashboard/campaigns': 'Ad Campaigns',
  '/dashboard/creative/design': 'Design Hub',
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
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && results[selected]) { router.push(results[selected].href); onClose(); }
    if (e.key === 'Escape') onClose();
  }

  const typeIcon: Record<string, string> = { task: '✓', project: '◆', client: '◉', doc: '▤' };
  const typeColor: Record<string, string> = {
    task: '#00E5A0', project: '#00D4FF', client: '#FF4D6A', doc: '#FFB547',
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', paddingTop: '12vh' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl mx-4 animate-scale-in overflow-hidden"
        style={{
          background: 'var(--card)',
          border: '1px solid rgba(112,48,239,0.3)',
          borderRadius: 20,
          boxShadow: '0 0 0 1px rgba(112,48,239,0.15), 0 32px 64px rgba(0,0,0,0.7), 0 0 80px rgba(112,48,239,0.12)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <MagnifyingGlass size={15} color="#fff" weight="bold" />
          </div>
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tasks, projects, clients, docs…"
            className="flex-1 bg-transparent text-base outline-none"
            style={{ color: 'var(--text)', fontFamily: 'var(--font-body, "DM Sans"), sans-serif' }}
          />
          {loading && (
            <div className="w-4 h-4 border-2 rounded-full animate-spin"
              style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
          )}
          <kbd style={{ fontSize: 11, padding: '3px 7px', borderRadius: 6, background: 'var(--surface)', color: 'var(--text-3)', border: '1px solid var(--border)', fontFamily: 'monospace' }}>ESC</kbd>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="py-2 max-h-80 overflow-y-auto">
            {results.map((r, i) => (
              <Link key={r.id} href={r.href} onClick={onClose}
                className="flex items-center gap-3 px-5 py-3 transition"
                style={{
                  background: i === selected ? 'rgba(112,48,239,0.1)' : 'transparent',
                  borderLeft: i === selected ? '2px solid var(--primary)' : '2px solid transparent',
                }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: `${typeColor[r.type]}18`,
                  color: typeColor[r.type],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                }}>{typeIcon[r.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{r.title}</p>
                  {r.subtitle && <p className="text-xs capitalize" style={{ color: 'var(--text-3)' }}>{r.subtitle}</p>}
                </div>
                <span className="text-xs capitalize px-2 py-0.5 rounded-full" style={{ background: `${typeColor[r.type]}18`, color: typeColor[r.type], fontWeight: 600 }}>{r.type}</span>
              </Link>
            ))}
          </div>
        )}

        {q && !loading && results.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>No results for <strong>&ldquo;{q}&rdquo;</strong></p>
          </div>
        )}

        {!q && (
          <div className="px-5 py-4">
            <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-3)', letterSpacing: '0.08em' }}>QUICK NAVIGATION</p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { key: 'G D', label: 'Dashboard', href: '/dashboard' },
                { key: 'G T', label: 'Tasks',     href: '/dashboard/tasks' },
                { key: 'G P', label: 'Projects',  href: '/dashboard/projects' },
                { key: 'C',   label: 'New Task',  href: '/dashboard/tasks?new=1' },
              ].map(item => (
                <Link key={item.key} href={item.href} onClick={onClose}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                >
                  <kbd style={{ fontSize: 10, padding: '2px 5px', borderRadius: 5, background: 'var(--card-2)', color: 'var(--text-2)', border: '1px solid var(--border)', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{item.key}</kbd>
                  <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Sidebar Nav Item ─────────────────────────────────────── */
function NavItem({
  item, active, collapsed, onClick,
}: {
  item: { label: string; href: string; Icon: any; color: string };
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: collapsed ? 0 : 10,
        height: 34,
        paddingLeft: collapsed ? 0 : 10,
        paddingRight: collapsed ? 0 : 10,
        marginLeft: collapsed ? 'auto' : 6,
        marginRight: collapsed ? 'auto' : 6,
        marginBottom: 1,
        width: collapsed ? 36 : 'auto',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: 9,
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        transition: 'all 0.18s ease',
        background: active
          ? 'var(--sidebar-active-bg)'
          : hovered
          ? 'var(--sidebar-hover-bg)'
          : 'transparent',
        color: active ? 'var(--sidebar-active-text)' : hovered ? 'var(--text)' : 'var(--sidebar-text)',
        boxShadow: active ? '0 0 14px rgba(112,48,239,0.2)' : 'none',
        position: 'relative',
        overflow: 'hidden',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {/* Active left indicator */}
      {active && !collapsed && (
        <span style={{
          position: 'absolute',
          left: 0, top: '50%',
          transform: 'translateY(-50%)',
          width: 3, height: 18,
          borderRadius: '0 3px 3px 0',
          background: 'var(--grad-brand)',
        }} />
      )}
      <span style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 18, height: 18,
        color: active ? item.color : hovered ? 'var(--text)' : 'var(--sidebar-icon)',
        transition: 'color 0.18s, transform 0.18s',
        transform: hovered ? 'scale(1.12)' : 'scale(1)',
      }}>
        <item.Icon size={15} weight={active ? 'fill' : 'regular'} />
      </span>
      {!collapsed && (
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.label}
        </span>
      )}
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, accessToken, logout } = useAuthStore();
  const { theme, toggle: toggleTheme } = useThemeStore();
  const [hydrated,    setHydrated]    = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [gPressed,    setGPressed]    = useState(false);
  const [collapsed,   setCollapsed]   = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);

  const userRole    = user?.role || 'member';
  const NAV_SECTIONS = ALL_NAV_SECTIONS
    .filter(s => !('roles' in s) || (s as any).roles?.includes(userRole))
    .map(s => ({ ...s, items: s.items.filter((i: any) => !i.roles || i.roles.includes(userRole)) }))
    .filter(s => s.items.length > 0);

  useEffect(() => { setHydrated(true); }, []);
  useEffect(() => {
    if (!hydrated) return;
    const stored = localStorage.getItem('sidebar-collapsed');
    if (stored === '1') setCollapsed(true);
  }, [hydrated]);
  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) window.location.href = '/';
  }, [hydrated, isAuthenticated]);

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

  async function handleLogout() {
    disconnectSocket();
    try {
      const token = accessToken || (window as any).__TASKSDONE_AUTH_TOKEN__;
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.tasksdone.cloud/api'}/auth/logout`, {
        method: 'POST', credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch {}
    logout();
    window.location.href = '/';
  }

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
  const sidebarExpanded = !collapsed || sidebarHovered;

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'var(--grad-brand)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'spin 1s linear infinite',
          boxShadow: '0 0 30px rgba(112,48,239,0.4)',
        }}>
          <Sparkle size={20} color="#fff" weight="fill" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const sidebarW = collapsed ? (sidebarHovered ? 240 : 60) : 240;

  /* ── Sidebar inner ─────────────────────────────────────────── */
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => {
    const expanded = isMobile ? true : sidebarExpanded;

    return (
      <aside
        className="flex-shrink-0 flex flex-col h-full"
        style={{
          width: isMobile ? 240 : sidebarW,
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
          transition: 'width 0.3s cubic-bezier(.16,1,.3,1)',
          fontFamily: 'var(--font-body, "DM Sans"), sans-serif',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Ambient gradient top */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 120,
          background: 'radial-gradient(ellipse at top, rgba(112,48,239,0.08) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* ── Logo ────────────────────────────────────────────── */}
        <div
          className="flex items-center flex-shrink-0"
          style={{
            height: 58, zIndex: 1, position: 'relative',
            borderBottom: '1px solid var(--sidebar-border)',
            justifyContent: expanded ? 'flex-start' : 'center',
            paddingLeft: expanded ? 16 : 0,
            gap: 10,
          }}
        >
          {/* Logo mark */}
          <div style={{
            width: 32, height: 32, borderRadius: 10, flexShrink: 0,
            background: 'var(--grad-brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(112,48,239,0.4)',
            fontSize: 13, fontWeight: 900, color: '#fff',
            fontFamily: 'var(--font-display)',
          }}>T</div>

          {expanded && (
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', fontFamily: 'var(--font-display, "Plus Jakarta Sans"), sans-serif', lineHeight: 1.2 }}>
                TasksDone
              </p>
              <p style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 500 }}>Agency Edition</p>
            </div>
          )}

          {expanded && (
            <button
              onClick={toggleTheme}
              style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--sidebar-border)',
                color: 'var(--text-3)', cursor: 'pointer', transition: 'all 0.15s',
              }}
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
            </button>
          )}
        </div>

        {/* ── Search + Create ──────────────────────────────────── */}
        <div style={{ padding: expanded ? '10px 10px 6px' : '10px 6px 6px', zIndex: 1, position: 'relative' }}>
          {expanded ? (
            <>
              <button
                onClick={() => setSearchOpen(true)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                  height: 32, paddingLeft: 10, paddingRight: 10,
                  borderRadius: 9, border: '1px solid var(--sidebar-border)',
                  background: 'rgba(255,255,255,0.03)', color: 'var(--text-3)',
                  fontSize: 12, cursor: 'pointer', transition: 'all 0.15s',
                  fontFamily: 'inherit', marginBottom: 6,
                }}
              >
                <MagnifyingGlass size={12} />
                <span style={{ flex: 1, textAlign: 'left' }}>Search…</span>
                <kbd style={{ fontSize: 10, padding: '1px 5px', borderRadius: 5, background: 'var(--card)', border: '1px solid var(--sidebar-border)', color: 'var(--text-3)', fontFamily: 'monospace' }}>⌘K</kbd>
              </button>
              <Link
                href="/dashboard/tasks?new=1"
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  height: 32, borderRadius: 9,
                  background: 'var(--grad-brand)',
                  color: '#fff', fontSize: 13, fontWeight: 600,
                  textDecoration: 'none', transition: 'opacity 0.15s',
                  boxShadow: '0 4px 16px rgba(112,48,239,0.3)',
                  fontFamily: 'var(--font-display, "Plus Jakarta Sans"), sans-serif',
                }}
              >
                <Plus size={13} weight="bold" />
                <span>Create</span>
              </Link>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <button
                onClick={() => setSearchOpen(true)}
                style={{
                  width: 36, height: 32, borderRadius: 9,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid var(--sidebar-border)',
                  color: 'var(--text-3)', cursor: 'pointer',
                }}
                title="Search (⌘K)"
              >
                <MagnifyingGlass size={14} />
              </button>
              <Link
                href="/dashboard/tasks?new=1"
                style={{
                  width: 36, height: 32, borderRadius: 9,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--grad-brand)', color: '#fff', textDecoration: 'none',
                  boxShadow: '0 0 12px rgba(112,48,239,0.35)',
                }}
                title="Create"
              >
                <Plus size={15} weight="bold" />
              </Link>
            </div>
          )}
        </div>

        {/* ── Navigation ───────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto" style={{ paddingBottom: 8, zIndex: 1, position: 'relative' }}>
          {NAV_SECTIONS.map((section, idx) => (
            <div key={section.label} style={{ marginBottom: 2 }}>
              {idx > 0 && (
                <div style={{ height: 1, background: 'var(--sidebar-border)', margin: expanded ? '6px 12px 4px' : '6px 8px 4px', opacity: 0.5 }} />
              )}
              {expanded && (
                <p style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.09em',
                  textTransform: 'uppercase', color: 'var(--sidebar-section-text)',
                  padding: '8px 16px 3px',
                }}>
                  {section.label}
                </p>
              )}
              {!expanded && <div style={{ height: 4 }} />}
              {section.items.map((item: any) => (
                <NavItem
                  key={item.href}
                  item={item}
                  active={isActive(item.href)}
                  collapsed={!expanded}
                  onClick={() => setSidebarOpen(false)}
                />
              ))}
            </div>
          ))}
        </nav>

        {/* ── Storage ─────────────────────────────────────────── */}
        {expanded && <StorageBar />}

        {/* ── Collapse toggle ──────────────────────────────────── */}
        {!isMobile && (
          <button
            onClick={toggleCollapsed}
            style={{
              width: '100%', height: 36, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-3)',
              background: 'none', border: 'none',
              borderTop: '1px solid var(--sidebar-border)',
              cursor: 'pointer', transition: 'color 0.15s',
              zIndex: 1, position: 'relative',
            } as any}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <CaretRight size={13} /> : <CaretLeft size={13} />}
          </button>
        )}

        {/* ── User footer ─────────────────────────────────────── */}
        {expanded ? (
          <div style={{ padding: '10px 12px', borderTop: '1px solid var(--sidebar-border)', zIndex: 1, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar name={user?.name || '?'} size={30} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
                <p style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'capitalize' }}>{user?.role}</p>
              </div>
              <NotificationBell />
              <button
                onClick={handleLogout}
                style={{
                  width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,77,106,0.1)', color: '#FF4D6A',
                  border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                }}
                title="Sign out"
              >
                <SignOut size={12} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, borderTop: '1px solid var(--sidebar-border)', zIndex: 1, position: 'relative' }}>
            <button onClick={handleLogout} title="Sign out" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <Avatar name={user?.name || '?'} size={30} />
            </button>
          </div>
        )}
      </aside>
    );
  };

  const bottomNavItems = [
    { Icon: House,       label: 'Home',     href: '/dashboard' },
    { Icon: CheckSquare, label: 'Tasks',    href: '/dashboard/tasks' },
    { Icon: Kanban,      label: 'Projects', href: '/dashboard/projects' },
    { Icon: ChatCircle,  label: 'Chat',     href: '/dashboard/chat' },
    { Icon: List,        label: 'More',     href: '', action: () => setSidebarOpen(true) },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}

      {/* Desktop sidebar */}
      <div
        className="hidden md:block flex-shrink-0"
        style={{ width: sidebarW, transition: 'width 0.3s cubic-bezier(.16,1,.3,1)', flexShrink: 0 }}
        onMouseEnter={() => collapsed && setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        <SidebarContent />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 flex flex-col h-full" style={{ animation: 'slideDown 0.3s ease' }}>
            <SidebarContent isMobile />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile topbar */}
        <header
          className="topbar-dashboard md:hidden flex items-center justify-between px-4 flex-shrink-0"
          style={{
            height: 56,
            background: 'var(--topbar-bg)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--topbar-border)',
          }}
        >
          <button onClick={() => setSidebarOpen(true)} style={{ color: 'var(--text-2)', background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
            <List size={20} />
          </button>
          <span className="gradient-text font-bold text-base" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
            TasksDone
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setSearchOpen(true)} style={{ color: 'var(--text-2)', background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
              <MagnifyingGlass size={17} />
            </button>
            <NotificationBell />
          </div>
        </header>

        {/* Desktop topbar */}
        <header
          className="topbar-dashboard hidden md:flex items-center justify-between px-6 flex-shrink-0"
          style={{
            height: 52,
            background: 'var(--topbar-bg)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--topbar-border)',
          }}
        >
          <div className="flex items-center gap-2">
            <h1 style={{
              fontSize: 14, fontWeight: 700,
              color: 'var(--text)',
              fontFamily: 'var(--font-display, "Plus Jakarta Sans"), sans-serif',
              letterSpacing: '-0.01em',
            }}>{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Search pill */}
            <button
              onClick={() => setSearchOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                height: 32, paddingLeft: 12, paddingRight: 10,
                borderRadius: 10,
                background: 'var(--card)',
                border: '1px solid var(--border)',
                color: 'var(--text-3)',
                fontSize: 12, cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'inherit',
                minWidth: 180,
              }}
            >
              <MagnifyingGlass size={12} />
              <span style={{ flex: 1, textAlign: 'left' }}>Search anything…</span>
              <kbd style={{ fontSize: 10, padding: '1px 5px', borderRadius: 4, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-3)', fontFamily: 'monospace' }}>⌘K</kbd>
            </button>

            <NotificationBell />

            <button
              onClick={toggleTheme}
              style={{
                width: 32, height: 32, borderRadius: 9,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--card)', border: '1px solid var(--border)',
                color: 'var(--text-2)', cursor: 'pointer', transition: 'all 0.15s',
              }}
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            <div style={{ width: 32, height: 32 }}>
              <Avatar name={user?.name || '?'} size={32} />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto main-with-bottom-nav" style={{ background: 'var(--bg)' }}>
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
