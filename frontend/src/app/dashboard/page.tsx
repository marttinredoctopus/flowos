'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/apiClient';
import { Avatar } from '@/components/ui/Avatar';

// ── Utility ──────────────────────────────────────────────────────────────────

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  icon, label, value, color, sub, warning, href,
}: {
  icon: string; label: string; value: number | string;
  color: string; sub?: string; warning?: boolean; href?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const border = warning && Number(value) > 0 ? color + '50' : 'var(--border)';
  const card = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--card-hover, #1e1e2e)' : 'var(--card)',
        border: `1px solid ${hovered ? color + '70' : border}`,
        borderBottom: `3px solid ${color}`,
        borderRadius: 16,
        padding: '20px 20px 18px',
        cursor: href ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        boxShadow: hovered ? `0 8px 32px ${color}18` : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* background glow */}
      <div style={{
        position: 'absolute', top: -20, right: -20, width: 80, height: 80,
        borderRadius: '50%', background: color + '12',
        transition: 'opacity 0.2s', opacity: hovered ? 1 : 0,
      }} />
      <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
      <div style={{
        fontSize: 32, fontWeight: 800, color: warning && Number(value) > 0 ? color : 'var(--text)',
        lineHeight: 1, marginBottom: 4,
      }}>
        {value}
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: sub ? 6 : 0 }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: color, fontWeight: 600 }}>{sub}</div>
      )}
    </div>
  );
  if (href) return <Link href={href} style={{ textDecoration: 'none' }}>{card}</Link>;
  return card;
}

function PriorityItem({
  icon, text, sub, color, href, badge,
}: {
  icon: string; text: string; sub?: string; color: string; href?: string; badge?: string;
}) {
  const [hov, setHov] = useState(false);
  const inner = (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px', borderRadius: 12,
        background: hov ? 'var(--card-hover, #1c1c2a)' : 'var(--surface)',
        border: `1px solid ${hov ? color + '44' : 'transparent'}`,
        transition: 'all 0.15s', cursor: href ? 'pointer' : 'default',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: color + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {text}
        </div>
        {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
      </div>
      {badge && (
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
          background: color + '22', color, flexShrink: 0, textTransform: 'uppercase',
        }}>{badge}</span>
      )}
      {href && (
        <span style={{ fontSize: 16, color: 'var(--text-muted)', flexShrink: 0 }}>›</span>
      )}
    </div>
  );
  if (href) return <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>{inner}</Link>;
  return inner;
}

function SectionHeader({ title, sub, href, hrefLabel = 'View all →' }: {
  title: string; sub?: string; href?: string; hrefLabel?: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{title}</h2>
        {sub && <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '3px 0 0' }}>{sub}</p>}
      </div>
      {href && (
        <Link href={href} style={{ fontSize: 12, color: '#6366f1', textDecoration: 'none', fontWeight: 500 }}>
          {hrefLabel}
        </Link>
      )}
    </div>
  );
}

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: 16, padding: 20, ...style,
    }}>
      {children}
    </div>
  );
}

// ── Admin / Owner Dashboard ───────────────────────────────────────────────────

function AdminDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [stats, setStats]       = useState<any>(null);
  const [tasks, setTasks]       = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients]   = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get('/dashboard/stats').then(r => r.data).catch(() => ({})),
      apiClient.get('/tasks').then(r => r.data).catch(() => []),
      apiClient.get('/projects').then(r => r.data).catch(() => []),
      apiClient.get('/clients').then(r => r.data).catch(() => []),
      apiClient.get('/dashboard/activity?limit=15').then(r => r.data?.activities || []).catch(() => []),
    ]).then(([s, t, p, c, a]) => {
      setStats(s);
      setTasks(Array.isArray(t) ? t : []);
      setProjects(Array.isArray(p) ? p : []);
      setClients(Array.isArray(c) ? c : []);
      setActivity(Array.isArray(a) ? a : []);
    }).finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const overdueTasks = tasks.filter(t => t.status !== 'done' && t.due_date && new Date(t.due_date) < now);
  const dueSoonTasks = tasks.filter(t => {
    if (t.status === 'done' || !t.due_date) return false;
    const d = new Date(t.due_date);
    const diff = (d.getTime() - now.getTime()) / 86400000;
    return diff >= 0 && diff <= 3;
  });
  const reviewTasks = tasks.filter(t => t.status === 'review');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');

  const priorityItems = [
    ...overdueTasks.slice(0, 3).map(t => ({
      icon: '⏰', text: t.title, sub: `Overdue · ${new Date(t.due_date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}`,
      color: '#ef5350', href: '/dashboard/tasks', badge: 'Overdue',
    })),
    ...reviewTasks.slice(0, 2).map(t => ({
      icon: '👀', text: t.title, sub: 'Waiting for your review',
      color: '#ffc107', href: '/dashboard/tasks', badge: 'Review',
    })),
    ...dueSoonTasks.slice(0, 2).map(t => ({
      icon: '📅', text: t.title, sub: `Due ${new Date(t.due_date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}`,
      color: '#4a9eff', href: '/dashboard/tasks', badge: 'Soon',
    })),
  ].slice(0, 6);

  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div style={{ padding: '28px 28px 60px', maxWidth: 1300, margin: '0 auto' }}>
      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: 28, flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 4px', fontWeight: 500 }}>
            {dateStr} · TasksDone
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', margin: 0, lineHeight: 1.2 }}>
            {greeting()},{' '}
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {user?.name?.split(' ')[0]}
            </span>{' '}
            👋
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '6px 0 0' }}>
            {loading ? 'Loading your workspace…' :
              overdueTasks.length > 0
                ? `⚠️ ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''} need attention`
                : `You have ${inProgressTasks.length} task${inProgressTasks.length !== 1 ? 's' : ''} in progress today`}
          </p>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { label: '+ New Task',     href: '/dashboard/tasks?new=1',   color: '#6366f1' },
            { label: '+ New Client',   href: '/dashboard/clients?new=1', color: '#06b6d4' },
            { label: '+ New Project',  href: '/dashboard/projects',      color: '#10b981' },
            { label: '⚡ Strategy Hub', href: '/dashboard/content/sections', color: '#a855f7' },
          ].map(a => (
            <QuickActionBtn key={a.label} label={a.label} href={a.href} color={a.color} />
          ))}
        </div>
      </div>

      {/* ── Stat Cards ── */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ height: 120, borderRadius: 16, background: 'var(--card)', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          <StatCard
            icon="👥" label="Active Clients" value={stats?.activeClients ?? clients.length}
            color="#06b6d4" sub={clients.length > 0 ? `${clients.length} total` : undefined}
            href="/dashboard/clients"
          />
          <StatCard
            icon="🚀" label="Active Projects" value={stats?.activeProjects ?? projects.filter(p => p.status !== 'completed').length}
            color="#6366f1" href="/dashboard/projects"
          />
          <StatCard
            icon="⚡" label="Tasks in Progress" value={inProgressTasks.length}
            color="#a855f7"
            sub={stats?.openTasks ? `${stats.openTasks} open total` : undefined}
            href="/dashboard/tasks"
          />
          <StatCard
            icon="⏳" label="Pending Approvals" value={stats?.pendingApprovals ?? reviewTasks.length}
            color="#ffc107" warning
            sub={stats?.overdueCount > 0 ? `${stats.overdueCount} overdue` : undefined}
            href="/dashboard/tasks"
          />
        </div>
      )}

      {/* ── Main Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Priority: What needs your attention */}
          {!loading && priorityItems.length > 0 && (
            <Card>
              <SectionHeader
                title="⚡ What needs your attention"
                sub={`${priorityItems.length} item${priorityItems.length !== 1 ? 's' : ''} require action`}
                href="/dashboard/tasks"
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {priorityItems.map((item, i) => (
                  <PriorityItem key={i} {...item} />
                ))}
              </div>
            </Card>
          )}

          {/* Client Overview */}
          <Card>
            <SectionHeader title="👥 Client Overview" href="/dashboard/clients" />
            {clients.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>👤</div>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>No clients yet</p>
                <Link href="/dashboard/clients?new=1" style={{
                  display: 'inline-block', padding: '8px 20px', borderRadius: 10,
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff',
                  fontSize: 13, fontWeight: 600, textDecoration: 'none',
                }}>Add first client</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                {clients.slice(0, 8).map((c: any) => (
                  <ClientCard key={c.id} client={c} projects={projects} />
                ))}
              </div>
            )}
          </Card>

          {/* Projects + Tasks */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <ProjectsWidget projects={projects} />
            <TasksWidget tasks={tasks.filter(t => t.assignee_id === user?.id).length > 0 ? tasks.filter(t => t.assignee_id === user?.id) : inProgressTasks} title="Tasks in Progress" />
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Quick Actions Panel */}
          <QuickActionsPanel />

          {/* Activity Feed */}
          <Card>
            <SectionHeader title="🕐 Recent Activity" sub="Last 14 days" />
            {activity.length === 0 ? (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
                No recent activity
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {activity.slice(0, 10).map((a: any, i: number) => (
                  <div key={i} style={{
                    display: 'flex', gap: 10, padding: '9px 0',
                    borderBottom: i < activity.slice(0, 10).length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, background: 'var(--surface)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, flexShrink: 0,
                    }}>{a.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, color: 'var(--text)', margin: 0, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {a.text}
                      </p>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                        {a.ts ? timeAgo(a.ts) : a.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Team snapshot */}
          <TeamSnapshot />
        </div>
      </div>
    </div>
  );
}

function QuickActionBtn({ label, href, color }: { label: string; href: string; color: string }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', height: 34, padding: '0 14px',
        borderRadius: 10, fontSize: 12, fontWeight: 600,
        background: hov ? color + '18' : 'var(--card)',
        border: `1px solid ${hov ? color + '80' : 'var(--border)'}`,
        color: hov ? color : 'var(--text-muted)',
        textDecoration: 'none', transition: 'all 0.15s',
      }}
    >
      {label}
    </Link>
  );
}

function ClientCard({ client, projects }: { client: any; projects: any[] }) {
  const [hov, setHov] = useState(false);
  const clientProjects = projects.filter(p => p.client_id === client.id || p.client_name === client.name);
  const active = clientProjects.filter(p => p.status !== 'completed').length;
  const avgProgress = clientProjects.length
    ? Math.round(clientProjects.reduce((s, p) => s + (p.progress || 0), 0) / clientProjects.length)
    : 0;

  return (
    <Link href={`/dashboard/clients/${client.id}`} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          padding: '12px 14px', borderRadius: 12,
          background: hov ? 'var(--card-hover, #1c1c2a)' : 'var(--surface)',
          border: `1px solid ${hov ? '#6366f144' : 'transparent'}`,
          transition: 'all 0.15s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Avatar name={client.name} size={26} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {client.name}
            </p>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0 }}>
              {active} active project{active !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        {clientProjects.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Progress</span>
              <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{avgProgress}%</span>
            </div>
            <div style={{ height: 3, borderRadius: 2, background: 'var(--border)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 2, width: `${avgProgress}%`,
                background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

function QuickActionsPanel() {
  const router = useRouter();
  const actions = [
    { icon: '📋', label: 'Create Task',   sub: 'Add a new task',     href: '/dashboard/tasks?new=1',          color: '#6366f1' },
    { icon: '👤', label: 'Add Client',    sub: 'Onboard a client',   href: '/dashboard/clients?new=1',        color: '#06b6d4' },
    { icon: '🎨', label: 'Upload Design', sub: 'Share with client',  href: '/dashboard/design',               color: '#ec4899' },
    { icon: '✍️', label: 'AI Content',   sub: 'Generate strategy',   href: '/dashboard/content/sections',     color: '#a855f7' },
    { icon: '📊', label: 'View Reports',  sub: 'Business insights',   href: '/dashboard/reports',              color: '#10b981' },
    { icon: '🚀', label: 'New Project',   sub: 'Start something new', href: '/dashboard/projects',             color: '#f59e0b' },
  ];
  return (
    <Card>
      <SectionHeader title="⚡ Quick Actions" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {actions.map(a => (
          <QuickActionCard key={a.label} {...a} onClick={() => router.push(a.href)} />
        ))}
      </div>
    </Card>
  );
}

function QuickActionCard({ icon, label, sub, color, onClick }: {
  icon: string; label: string; sub: string; color: string; onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        padding: '10px 12px', borderRadius: 10, textAlign: 'left',
        background: hov ? color + '12' : 'var(--surface)',
        border: `1px solid ${hov ? color + '50' : 'transparent'}`,
        cursor: 'pointer', transition: 'all 0.15s', width: '100%',
      }}
    >
      <span style={{ fontSize: 18, marginBottom: 4 }}>{icon}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: hov ? color : 'var(--text)' }}>{label}</span>
      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{sub}</span>
    </button>
  );
}

function TeamSnapshot() {
  const [team, setTeam] = useState<any[]>([]);
  useEffect(() => {
    apiClient.get('/team').then(r => setTeam(Array.isArray(r.data) ? r.data.slice(0, 5) : [])).catch(() => {});
  }, []);
  if (team.length === 0) return null;
  return (
    <Card>
      <SectionHeader title="👋 Team" href="/dashboard/team" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {team.map((m: any) => (
          <div key={m.user_id || m.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name={m.name} size={28} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', margin: 0 }}>{m.name}</p>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0 }}>{m.role}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ProjectsWidget({ projects }: { projects: any[] }) {
  return (
    <Card>
      <SectionHeader title="🚀 Projects" href="/dashboard/projects" />
      {projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>No projects yet</p>
          <Link href="/dashboard/projects" style={{
            display: 'inline-block', padding: '7px 16px', borderRadius: 8,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff',
            fontSize: 12, fontWeight: 600, textDecoration: 'none',
          }}>Create project</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {projects.slice(0, 5).map((p: any) => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 10px', borderRadius: 10, background: 'var(--surface)',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color || '#6366f1', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.name}
                </p>
                {p.client_name && (
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0 }}>{p.client_name}</p>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 50, height: 3, borderRadius: 2, background: 'var(--border)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${p.progress || 0}%`,
                    background: 'linear-gradient(90deg, #6366f1, #a855f7)', borderRadius: 2,
                  }} />
                </div>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', width: 28, textAlign: 'right' }}>
                  {p.progress || 0}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function TasksWidget({ tasks, title = 'Tasks' }: { tasks: any[]; title?: string }) {
  const pc: Record<string, string> = { high: '#ef5350', medium: '#ffc107', low: '#4caf82' };
  const sc: Record<string, string> = { done: '#4caf82', in_progress: '#4a9eff', review: '#ffc107', todo: '#7b7fa8' };
  return (
    <Card>
      <SectionHeader title={title} href="/dashboard/tasks" />
      {tasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ fontSize: 32, margin: '0 0 8px' }}>✅</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>All clear!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {tasks.slice(0, 6).map((t: any) => (
            <div key={t.id} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 10px', borderRadius: 10, background: 'var(--surface)',
              borderLeft: `3px solid ${pc[t.priority] || '#7b7fa8'}`,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, color: 'var(--text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t.title}
                </p>
                {t.due_date && (
                  <p style={{ fontSize: 10, margin: '2px 0 0', color: new Date(t.due_date) < new Date() && t.status !== 'done' ? '#ef5350' : 'var(--text-muted)' }}>
                    Due {new Date(t.due_date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  </p>
                )}
              </div>
              <span style={{
                fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20,
                background: (sc[t.status] || '#7b7fa8') + '22',
                color: sc[t.status] || '#7b7fa8', flexShrink: 0, textTransform: 'capitalize',
              }}>
                {t.status?.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// ── Manager Dashboard ─────────────────────────────────────────────────────────

function ManagerDashboard() {
  const { user } = useAuthStore();
  const [projects, setProjects]       = useState<any[]>([]);
  const [tasks, setTasks]             = useState<any[]>([]);
  const [activity, setActivity]       = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get('/dashboard/manager-stats').then(r => r.data).catch(() => ({})),
      apiClient.get('/projects').then(r => r.data).catch(() => []),
      apiClient.get('/tasks').then(r => r.data).catch(() => []),
      apiClient.get('/dashboard/activity?limit=10').then(r => r.data?.activities || []).catch(() => []),
    ]).then(([_s, p, t, a]) => {
      setProjects(Array.isArray(p) ? p : []);
      setTasks(Array.isArray(t) ? t : []);
      setActivity(Array.isArray(a) ? a : []);
    }).finally(() => setLoading(false));
  }, []);

  const reviewTasks = tasks.filter(t => t.status === 'review');
  const overdue     = tasks.filter(t => t.status !== 'done' && t.due_date && new Date(t.due_date) < new Date());
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div style={{ padding: '28px 28px 60px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 4px' }}>{dateStr}</p>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', margin: 0 }}>
          {greeting()},{' '}
          <span style={{ background: 'linear-gradient(135deg, #06b6d4, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {user?.name?.split(' ')[0]}
          </span>
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '6px 0 0' }}>
          Here's what your team is working on.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          {[1,2,3,4].map(i => <div key={i} style={{ height: 110, borderRadius: 16, background: 'var(--card)', animation: 'pulse 1.5s infinite' }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          <StatCard icon="🚀" label="Active Projects" value={projects.filter(p => p.status !== 'completed').length} color="#6366f1" />
          <StatCard icon="👀" label="Needs Review" value={reviewTasks.length} color="#ffc107" warning href="/dashboard/tasks" />
          <StatCard icon="⚡" label="Open Tasks" value={tasks.filter(t => t.status !== 'done').length} color="#a855f7" />
          <StatCard icon="⏰" label="Overdue" value={overdue.length} color="#ef5350" warning />
        </div>
      )}

      {reviewTasks.length > 0 && (
        <Card style={{ marginBottom: 20, background: 'rgba(255,193,7,0.05)', borderColor: 'rgba(255,193,7,0.2)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#ffc107', marginBottom: 10 }}>
            👀 {reviewTasks.length} task{reviewTasks.length !== 1 ? 's' : ''} waiting for your review
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {reviewTasks.slice(0, 4).map((t: any) => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'var(--card)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffc107', flexShrink: 0 }} />
                <p style={{ flex: 1, fontSize: 13, color: 'var(--text)', margin: 0 }}>{t.title}</p>
                <Link href="/dashboard/tasks" style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, background: '#ffc10722', color: '#ffc107', textDecoration: 'none', fontWeight: 600 }}>
                  Review
                </Link>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <ProjectsWidget projects={projects} />
        <TasksWidget tasks={tasks} title="Team Tasks" />
      </div>
    </div>
  );
}

// ── Member Dashboard ──────────────────────────────────────────────────────────

function MemberDashboard() {
  const { user } = useAuthStore();
  const [tasks, setTasks]       = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get('/tasks').then(r => r.data).catch(() => []),
      apiClient.get('/projects').then(r => r.data).catch(() => []),
    ]).then(([t, p]) => {
      const all = Array.isArray(t) ? t : [];
      const mine = all.filter((task: any) => task.assignee_id === user?.id);
      setTasks(mine.length > 0 ? mine : all);
      setProjects(Array.isArray(p) ? p : []);
    }).finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const open     = tasks.filter(t => t.status !== 'done');
  const dueToday = tasks.filter(t => {
    if (!t.due_date) return false;
    return new Date(t.due_date).toDateString() === now.toDateString();
  });
  const done     = tasks.filter(t => t.status === 'done');
  const dateStr  = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div style={{ padding: '28px 28px 60px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 4px' }}>{dateStr}</p>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', margin: 0 }}>
          {greeting()},{' '}
          <span style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {user?.name?.split(' ')[0]}
          </span>{' '}👋
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '6px 0 0' }}>
          {dueToday.length > 0 ? `📅 ${dueToday.length} task${dueToday.length > 1 ? 's' : ''} due today` : "Here's what you're working on."}
        </p>
      </div>

      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          <StatCard icon="⚡" label="Open Tasks" value={open.length} color="#6366f1" />
          <StatCard icon="📅" label="Due Today" value={dueToday.length} color="#ffc107" warning href="/dashboard/tasks" />
          <StatCard icon="✅" label="Completed" value={done.length} color="#10b981" />
          <StatCard icon="🚀" label="Projects" value={projects.length} color="#a855f7" />
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <TasksWidget tasks={open} title="My Open Tasks" />
        <ProjectsWidget projects={projects} />
      </div>
    </div>
  );
}

// ── Client Dashboard ──────────────────────────────────────────────────────────

function ClientDashboard() {
  const { user } = useAuthStore();
  const [projects, setProjects]             = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [loading, setLoading]               = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get('/projects').then(r => r.data).catch(() => []),
      apiClient.get('/tasks?status=client_approval').then(r => r.data).catch(() => []),
    ]).then(([p, a]) => {
      setProjects(Array.isArray(p) ? p : []);
      setPendingApprovals(Array.isArray(a) ? a : []);
    }).finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div style={{ padding: '28px 28px 60px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 4px' }}>{dateStr}</p>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', margin: 0 }}>
          {greeting()},{' '}
          <span style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {user?.name?.split(' ')[0]}
          </span>{' '}👋
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '6px 0 0' }}>Here's how your projects are going.</p>
      </div>

      {pendingApprovals.length > 0 && (
        <Card style={{ marginBottom: 20, background: 'rgba(74,158,255,0.05)', borderColor: 'rgba(74,158,255,0.2)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#4a9eff', marginBottom: 10 }}>
            🔔 {pendingApprovals.length} item{pendingApprovals.length !== 1 ? 's' : ''} waiting for your approval
          </div>
          {pendingApprovals.map((item: any) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'var(--card)', marginBottom: 6 }}>
              <p style={{ flex: 1, fontSize: 13, color: 'var(--text)', margin: 0 }}>{item.title}</p>
              <Link href="/dashboard/tasks" style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, background: '#4a9eff22', color: '#4a9eff', textDecoration: 'none', fontWeight: 600 }}>
                Review
              </Link>
            </div>
          ))}
        </Card>
      )}

      <ProjectsWidget projects={projects} />
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuthStore();

  if (user?.role === 'manager') return <ManagerDashboard />;
  if (user?.role === 'member')  return <MemberDashboard />;
  if (user?.role === 'client')  return <ClientDashboard />;
  return <AdminDashboard />;
}
