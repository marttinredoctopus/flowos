'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/apiClient';

const STAT_CARDS = [
  { key: 'projects', label: 'Total Projects', icon: '◈', bg: 'linear-gradient(135deg, #4a9eff22, #4a9eff11)', accent: '#4a9eff', href: '/dashboard/projects' },
  { key: 'myTasks', label: 'My Tasks', icon: '✓', bg: 'linear-gradient(135deg, #7c6fe022, #7c6fe011)', accent: '#7c6fe0', href: '/dashboard/tasks' },
  { key: 'inProgress', label: 'In Progress', icon: '⚡', bg: 'linear-gradient(135deg, #ffc10722, #ffc10711)', accent: '#ffc107', href: '/dashboard/tasks' },
  { key: 'done', label: 'Completed', icon: '★', bg: 'linear-gradient(135deg, #4caf8222, #4caf8211)', accent: '#4caf82', href: '/dashboard/tasks' },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [p, t] = await Promise.all([
          apiClient.get('/projects').then(r => r.data).catch(() => []),
          apiClient.get('/tasks').then(r => r.data).catch(() => []),
        ]);
        setProjects(Array.isArray(p) ? p : []);
        setTasks(Array.isArray(t) ? t : []);
      } finally { setLoading(false); }
    }
    load();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const myTasks = tasks.filter(t => t.assignee_id === user?.id);
  const doneTasks = tasks.filter(t => t.status === 'done');
  const inProgress = tasks.filter(t => t.status === 'in_progress');

  const statValues: Record<string, number> = {
    projects: projects.length,
    myTasks: myTasks.length,
    inProgress: inProgress.length,
    done: doneTasks.length,
  };

  const priorityColor: Record<string, string> = {
    high: '#ef5350',
    medium: '#ffc107',
    low: '#4caf82',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>
          {greeting},{' '}
          <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Here's your agency overview for today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map(s => (
          <Link key={s.key} href={s.href}
            className="p-5 rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
            style={{ background: 'var(--card)', border: `1px solid ${s.accent}33` }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold"
                style={{ background: s.bg, color: s.accent }}>
                {s.icon}
              </div>
              <svg className="w-4 h-4 opacity-40" style={{ color: s.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </div>
            <div className="text-3xl font-bold mb-1" style={{ color: s.accent }}>
              {loading ? <span className="inline-block w-8 h-7 rounded bg-white/5 animate-pulse" /> : statValues[s.key]}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-base" style={{ color: 'var(--text)' }}>Recent Projects</h2>
            <Link href="/dashboard/projects" className="text-xs font-medium transition hover:opacity-80" style={{ color: 'var(--blue)' }}>View all →</Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: 'var(--surface)' }} />)}</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-3xl mb-2">📁</div>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>No projects yet</p>
              <Link href="/dashboard/projects" className="px-4 py-2 gradient-bg rounded-lg text-sm font-semibold text-white hover:opacity-90 transition">Create project</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {projects.slice(0, 5).map((p: any) => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl transition cursor-pointer group"
                  style={{ background: 'var(--surface)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--card-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface)')}>
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color || '#7c6fe0' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{p.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.client_name || 'No client'}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                      <div className="h-full rounded-full gradient-bg" style={{ width: `${p.progress || 0}%` }} />
                    </div>
                    <span className="text-xs w-8 text-right" style={{ color: 'var(--text-muted)' }}>{p.progress || 0}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Tasks */}
        <div className="rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-base" style={{ color: 'var(--text)' }}>My Tasks</h2>
            <Link href="/dashboard/tasks" className="text-xs font-medium transition hover:opacity-80" style={{ color: 'var(--blue)' }}>View all →</Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: 'var(--surface)' }} />)}</div>
          ) : myTasks.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>No tasks assigned</p>
              <Link href="/dashboard/tasks" className="px-4 py-2 gradient-bg rounded-lg text-sm font-semibold text-white hover:opacity-90 transition">Browse tasks</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {myTasks.slice(0, 5).map((t: any) => (
                <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl transition cursor-pointer"
                  style={{ background: 'var(--surface)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--card-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface)')}>
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: priorityColor[t.priority] || '#7b7fa8' }} />
                  <p className="flex-1 text-sm truncate" style={{ color: 'var(--text)' }}>{t.title}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium"
                    style={{
                      background: t.status === 'done' ? '#4caf8222' : t.status === 'in_progress' ? '#4a9eff22' : 'var(--surface)',
                      color: t.status === 'done' ? '#4caf82' : t.status === 'in_progress' ? '#4a9eff' : 'var(--text-muted)',
                    }}>
                    {t.status?.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
