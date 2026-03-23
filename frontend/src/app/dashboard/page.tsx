'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet } from '@/lib/api';
import { LoadingScreen, EmptyState, StatusBadge, PriorityBadge, formatDate, getPriorityColor } from '@/components/ui/shared';

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function isOverdue(date: string) {
  return new Date(date) < new Date();
}

export default function Dashboard() {
  const [stats, setStats]       = useState<any>(null);
  const [tasks, setTasks]       = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      apiGet('/api/dashboard/stats').catch(() => null),
      apiGet('/api/tasks?limit=8&status=in_progress').catch(() => null),
      apiGet('/api/projects?limit=6').catch(() => null),
    ]).then(([statsData, tasksData, projectsData]) => {
      setStats(statsData?.data || statsData || {});
      const t = tasksData?.data?.tasks ?? tasksData?.tasks ?? tasksData?.data ?? tasksData ?? [];
      const p = projectsData?.data?.projects ?? projectsData?.projects ?? projectsData?.data ?? projectsData ?? [];
      setTasks(Array.isArray(t) ? t : []);
      setProjects(Array.isArray(p) ? p : []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;

  const statCards = [
    { label: 'Active Projects', value: stats?.active_projects ?? stats?.activeProjects ?? projects.length ?? 0, icon: '📁', color: '#6366f1', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)' },
    { label: 'Open Tasks',      value: stats?.open_tasks ?? stats?.pendingTasks ?? 0,                           icon: '✅', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)' },
    { label: 'Due Today',       value: stats?.due_today ?? stats?.dueToday ?? 0,                                icon: '⏰', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
    { label: 'Team Members',    value: stats?.team_members ?? stats?.teamMembers ?? 0,                          icon: '👥', color: '#22c55e', bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.2)'  },
  ];

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>
          Good {getTimeOfDay()} 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Here&apos;s what&apos;s happening with your agency today.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }} className="dash-stats">
        {statCards.map(card => (
          <div key={card.label} style={{ background: card.bg, border: `1px solid ${card.border}`, borderRadius: 14, padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: card.color, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{card.label}</span>
              <span style={{ fontSize: 22 }}>{card.icon}</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--text)', lineHeight: 1 }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Projects + Tasks grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recent Projects */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Recent Projects</h3>
            <button onClick={() => router.push('/dashboard/projects')} style={{ fontSize: 12, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all →</button>
          </div>
          {projects.length === 0 ? (
            <EmptyState icon="📁" text="No projects yet" action="Create Project" onAction={() => router.push('/dashboard/projects')} />
          ) : (
            projects.slice(0, 5).map((p: any) => (
              <div key={p.id} onClick={() => router.push('/dashboard/projects')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: p.color || '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  {p.icon || '📁'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.client_name || 'No client'} · {p.task_count || 0} tasks</div>
                </div>
                <StatusBadge status={p.status || 'active'} />
              </div>
            ))
          )}
        </div>

        {/* In Progress Tasks */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>In Progress Tasks</h3>
            <button onClick={() => router.push('/dashboard/tasks')} style={{ fontSize: 12, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all →</button>
          </div>
          {tasks.length === 0 ? (
            <EmptyState icon="✅" text="No tasks in progress" action="Create Task" onAction={() => router.push('/dashboard/tasks')} />
          ) : (
            tasks.map((t: any) => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: getPriorityColor(t.priority), marginTop: 5, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {t.project_name || 'No project'}{t.due_date ? ` · Due ${formatDate(t.due_date)}` : ''}{t.due_date && isOverdue(t.due_date) ? ' ⚠️' : ''}
                  </div>
                </div>
                <PriorityBadge priority={t.priority} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {[
          { label: 'New Task',    icon: '✅', href: '/dashboard/tasks',           color: '#6366f1' },
          { label: 'New Project', icon: '📁', href: '/dashboard/projects',         color: '#8b5cf6' },
          { label: 'New Client',  icon: '👥', href: '/dashboard/clients',          color: '#06b6d4' },
          { label: 'New Invoice', icon: '🧾', href: '/dashboard/finance/invoices', color: '#10b981' },
        ].map(a => (
          <button key={a.label} onClick={() => router.push(a.href)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card)', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left', width: '100%' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = a.color; (e.currentTarget as HTMLButtonElement).style.background = `${a.color}10`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--card)'; }}
          >
            <span style={{ fontSize: 20 }}>{a.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
