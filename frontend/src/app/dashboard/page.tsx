'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/apiClient';
import NotificationBell from '@/components/notifications/NotificationBell';

interface Stats {
  totalTasks: number;
  doneTasks: number;
  inProgressTasks: number;
  totalProjects: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/'); return; }
    loadData();
  }, [isAuthenticated]);

  async function loadData() {
    try {
      const [p, t] = await Promise.all([
        apiClient.get('/projects').then(r => r.data),
        apiClient.get('/tasks').then(r => r.data),
      ]);
      setProjects(p);
      setTasks(t);
    } catch {
      router.replace('/');
    } finally {
      setLoading(false);
    }
  }

  const stats: Stats = {
    totalTasks: tasks.length,
    doneTasks: tasks.filter(t => t.status === 'done').length,
    inProgressTasks: tasks.filter(t => t.status === 'in_progress').length,
    totalProjects: projects.length,
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Topbar */}
      <header className="glass border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display font-bold text-xl gradient-text">FlowOS</span>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-sm font-bold">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm text-slate-300">{user?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-1">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-slate-400">Here's what's happening at your agency today.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Tasks', value: stats.totalTasks, icon: '✅', color: 'text-brand-blue' },
            { label: 'In Progress', value: stats.inProgressTasks, icon: '⚡', color: 'text-brand-purple' },
            { label: 'Completed', value: stats.doneTasks, icon: '🏆', color: 'text-green-400' },
            { label: 'Projects', value: stats.totalProjects, icon: '📁', color: 'text-brand-pink' },
          ].map((s) => (
            <div key={s.label} className="p-6 rounded-2xl bg-dark-800 border border-white/5">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className={`font-display text-3xl font-bold mb-1 ${s.color}`}>{loading ? '–' : s.value}</div>
              <div className="text-slate-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <div className="bg-dark-800 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg">Recent Projects</h2>
              <button onClick={() => router.push('/dashboard/projects')} className="text-brand-blue text-sm hover:underline">View all →</button>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-12 rounded-lg bg-dark-700 animate-pulse" />)}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📁</div>
                <p className="text-slate-400 mb-4">No projects yet</p>
                <button onClick={() => router.push('/dashboard/projects')} className="px-4 py-2 gradient-bg rounded-lg text-sm font-medium">
                  Create first project
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 5).map((p: any) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-dark-700 transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/projects/${p.id}`)}>
                    <div className="w-3 h-3 rounded-full" style={{ background: p.color || '#4f8cff' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.client_name || 'No client'}</p>
                    </div>
                    <div className="text-xs text-slate-400">{p.progress}%</div>
                    <div className="w-16 h-1.5 bg-dark-600 rounded-full overflow-hidden">
                      <div className="h-full gradient-bg rounded-full" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Tasks */}
          <div className="bg-dark-800 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg">My Tasks</h2>
              <button onClick={() => router.push('/dashboard/tasks')} className="text-brand-blue text-sm hover:underline">View all →</button>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-12 rounded-lg bg-dark-700 animate-pulse" />)}
              </div>
            ) : tasks.filter(t => t.assignee_id === user?.id).length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">✅</div>
                <p className="text-slate-400 mb-4">No tasks assigned yet</p>
                <button onClick={() => router.push('/dashboard/tasks')} className="px-4 py-2 gradient-bg rounded-lg text-sm font-medium">
                  Browse tasks
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.filter(t => t.assignee_id === user?.id).slice(0, 5).map((t: any) => (
                  <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-dark-700 transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/tasks/${t.id}`)}>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      t.priority === 'high' ? 'bg-red-400' : t.priority === 'medium' ? 'bg-yellow-400' : 'bg-slate-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{t.title}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      t.status === 'done' ? 'bg-green-500/20 text-green-400' :
                      t.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-dark-600 text-slate-400'
                    }`}>{t.status?.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
